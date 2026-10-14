import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { seedData } from '../data/seed'
import {
  addMonths,
  applySuspensionRules,
  arraysEqualAsSet,
  canAccessLearning,
  canViewArchive,
  canViewProfile,
  isAccountActive,
  isAccountSuspended,
  resolveLearnerStatus,
  shuffle,
  uid,
} from '../lib/utils'
import type {
  AppData,
  Attempt,
  AttemptAnswer,
  Chapter,
  Question,
  User,
} from '../types'

const STORAGE_KEY = 'tariq_mvp_v8'
const SESSION_KEY = 'tariq_session_user'

interface AuthResult {
  ok: boolean
  error?: string
  user?: User
}

interface CreateLearnerInput {
  fullName: string
  email: string
  phone: string
  password: string
}

interface AppContextValue {
  data: AppData
  currentUser: User | null
  ready: boolean
  login: (email: string, password: string) => AuthResult
  logout: () => void
  createLearner: (input: CreateLearnerInput) => AuthResult
  /** Set ACTIVE + new 3 months. Account is never deleted. */
  reactivateAccount: (userId: string) => void
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  resetPassword: (userId: string, password: string) => void
  saveChapter: (chapter: Chapter) => void
  deleteChapter: (chapterId: string) => void
  saveQuestion: (question: Question) => void
  deleteQuestion: (questionId: string) => void
  markChapterComplete: (chapterId: string) => void
  submitPractice: (chapterId: string | null, answers: AttemptAnswer[]) => Attempt | null
  startMockExamQuestions: () => Question[]
  submitMockExam: (answers: AttemptAnswer[], startedAt: string) => Attempt | null
  resetDemoData: () => void
  learningAccess: boolean
  archiveAccess: boolean
  profileAccess: boolean
  suspended: boolean
  accountActive: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

function normalizeData(raw: AppData): AppData {
  const migratedUsers = raw.users.map((u) => {
    const status = String(u.status)
    if (status === 'PENDING') {
      return { ...u, status: 'SUSPENDED' as const }
    }
    return u
  })
  const chapters = raw.chapters.map((c) => ({
    ...c,
    coverImage: c.coverImage ?? null,
  }))
  const questions = raw.questions.map((q) => ({
    ...q,
    imageUrl: q.imageUrl || '/situations/intersection.svg',
  }))
  return {
    ...raw,
    chapters,
    questions,
    users: applySuspensionRules(migratedUsers),
  }
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return normalizeData(structuredClone(seedData))
    return normalizeData(JSON.parse(raw) as AppData)
  } catch {
    return normalizeData(structuredClone(seedData))
  }
}

function persist(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function scoreAnswers(questions: Question[], answers: AttemptAnswer[]) {
  let score = 0
  const detailed: AttemptAnswer[] = answers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId)
    if (!question) return { ...answer, correct: false }
    const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o.id)
    const correct = arraysEqualAsSet(answer.selectedOptionIds, correctIds)
    if (correct) score += 1
    return { ...answer, correct }
  })
  return { score, detailed }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setData((prev) => {
      const nextUsers = applySuspensionRules(prev.users)
      const changed = nextUsers.some((u, i) => u.status !== prev.users[i]?.status)
      return changed ? { ...prev, users: nextUsers } : prev
    })
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const user = applySuspensionRules(data.users).find((u) => u.id === sessionId) ?? null
      setCurrentUser(user)
    }
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    persist(data)
  }, [data])

  useEffect(() => {
    if (!currentUser) return
    const fresh = data.users.find((u) => u.id === currentUser.id) ?? null
    setCurrentUser(fresh)
  }, [data.users, currentUser?.id])

  const syncUser = useCallback((user: User | null) => {
    setCurrentUser(user)
    if (user) localStorage.setItem(SESSION_KEY, user.id)
    else localStorage.removeItem(SESSION_KEY)
  }, [])

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      setData((prev) => ({ ...prev, users: applySuspensionRules(prev.users) }))
      const users = applySuspensionRules(data.users)
      const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!user || user.password !== password) {
        return { ok: false, error: 'بيانات الدخول غير صحيحة' }
      }
      if (user.status === 'BLOCKED') {
        return { ok: false, error: 'تم إيقاف هذا الحساب. تواصل مع الإدارة.' }
      }
      const normalized = { ...user, status: resolveLearnerStatus(user) }
      syncUser(normalized)
      return { ok: true, user: normalized }
    },
    [data.users, syncUser],
  )

  const logout = useCallback(() => syncUser(null), [syncUser])

  const createLearner = useCallback(
    (input: CreateLearnerInput): AuthResult => {
      const email = input.email.trim().toLowerCase()
      const exists = data.users.some((u) => u.email.toLowerCase() === email)
      if (exists) return { ok: false, error: 'اسم المستخدم / البريد مستعمل مسبقاً' }
      if (input.password.trim().length < 6) {
        return { ok: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
      }

      const user: User = {
        id: uid('user'),
        email,
        password: input.password,
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        role: 'LEARNER',
        status: 'ACTIVE',
        subscriptionEndsAt: addMonths(
          new Date(),
          data.settings.subscriptionMonths,
        ).toISOString(),
        createdAt: new Date().toISOString(),
      }

      setData((prev) => ({ ...prev, users: [...prev.users, user] }))
      return { ok: true, user }
    },
    [data.settings.subscriptionMonths, data.users],
  )

  const reactivateAccount = useCallback((userId: string) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== userId) return u
        return {
          ...u,
          status: 'ACTIVE' as const,
          subscriptionEndsAt: addMonths(
            new Date(),
            prev.settings.subscriptionMonths,
          ).toISOString(),
        }
      }),
    }))
  }, [])

  const blockUser = useCallback((userId: string) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, status: 'BLOCKED' as const } : u,
      ),
    }))
  }, [])

  const unblockUser = useCallback((userId: string) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== userId || u.status !== 'BLOCKED') return u
        const status = shouldStaySuspended(u)
          ? ('SUSPENDED' as const)
          : ('ACTIVE' as const)
        return { ...u, status }
      }),
    }))
  }, [])

  function shouldStaySuspended(u: User) {
    return (
      !u.subscriptionEndsAt || new Date(u.subscriptionEndsAt).getTime() <= Date.now()
    )
  }

  const resetPassword = useCallback((userId: string, password: string) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, password } : u)),
    }))
  }, [])

  const saveChapter = useCallback((chapter: Chapter) => {
    setData((prev) => {
      const exists = prev.chapters.some((c) => c.id === chapter.id)
      return {
        ...prev,
        chapters: exists
          ? prev.chapters.map((c) => (c.id === chapter.id ? chapter : c))
          : [...prev.chapters, chapter],
      }
    })
  }, [])

  const deleteChapter = useCallback((chapterId: string) => {
    setData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((c) => c.id !== chapterId),
      questions: prev.questions.map((q) =>
        q.chapterId === chapterId ? { ...q, chapterId: null } : q,
      ),
      progress: prev.progress.filter((p) => p.chapterId !== chapterId),
    }))
  }, [])

  const saveQuestion = useCallback((question: Question) => {
    setData((prev) => {
      const exists = prev.questions.some((q) => q.id === question.id)
      return {
        ...prev,
        questions: exists
          ? prev.questions.map((q) => (q.id === question.id ? question : q))
          : [...prev.questions, question],
      }
    })
  }, [])

  const deleteQuestion = useCallback((questionId: string) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }, [])

  const markChapterComplete = useCallback(
    (chapterId: string) => {
      if (!currentUser || !canAccessLearning(currentUser)) return
      setData((prev) => {
        const exists = prev.progress.some(
          (p) => p.userId === currentUser.id && p.chapterId === chapterId,
        )
        if (exists) return prev
        return {
          ...prev,
          progress: [
            ...prev.progress,
            {
              userId: currentUser.id,
              chapterId,
              completedAt: new Date().toISOString(),
            },
          ],
        }
      })
    },
    [currentUser],
  )

  const submitPractice = useCallback(
    (chapterId: string | null, answers: AttemptAnswer[]) => {
      if (!currentUser || !canAccessLearning(currentUser)) return null
      const pool = data.questions.filter(
        (q) =>
          q.active &&
          (chapterId ? q.chapterId === chapterId : true),
      )
      const used = pool.filter((q) =>
        answers.some((a) => a.questionId === q.id),
      )
      const { score, detailed } = scoreAnswers(used, answers)
      const attempt: Attempt = {
        id: uid('att'),
        userId: currentUser.id,
        type: 'PRACTICE',
        chapterId,
        score,
        total: used.length,
        passed: used.length > 0 ? score / used.length >= 0.875 : false,
        answers: detailed,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
      }
      setData((prev) => ({ ...prev, attempts: [attempt, ...prev.attempts] }))
      return attempt
    },
    [currentUser, data.questions],
  )

  const startMockExamQuestions = useCallback(() => {
    const active = data.questions.filter((q) => q.active)
    const count = Math.min(data.settings.questionCount, active.length)
    return shuffle(active).slice(0, count)
  }, [data.questions, data.settings.questionCount])

  const submitMockExam = useCallback(
    (answers: AttemptAnswer[], startedAt: string) => {
      if (!currentUser || !canAccessLearning(currentUser)) return null
      const questionMap = new Map(data.questions.map((q) => [q.id, q]))
      const used = answers
        .map((a) => questionMap.get(a.questionId))
        .filter((q): q is Question => Boolean(q))
      const { score, detailed } = scoreAnswers(used, answers)
      const passed = score >= data.settings.passThreshold
      const attempt: Attempt = {
        id: uid('att'),
        userId: currentUser.id,
        type: 'MOCK_EXAM',
        chapterId: null,
        score,
        total: used.length,
        passed,
        answers: detailed,
        startedAt,
        finishedAt: new Date().toISOString(),
      }
      setData((prev) => ({ ...prev, attempts: [attempt, ...prev.attempts] }))
      return attempt
    },
    [currentUser, data.questions, data.settings.passThreshold],
  )

  const resetDemoData = useCallback(() => {
    const fresh = structuredClone(seedData)
    setData(fresh)
    persist(fresh)
    syncUser(null)
  }, [syncUser])

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      currentUser,
      ready,
      login,
      logout,
      createLearner,
      reactivateAccount,
      blockUser,
      unblockUser,
      resetPassword,
      saveChapter,
      deleteChapter,
      saveQuestion,
      deleteQuestion,
      markChapterComplete,
      submitPractice,
      startMockExamQuestions,
      submitMockExam,
      resetDemoData,
      learningAccess: canAccessLearning(currentUser),
      archiveAccess: canViewArchive(currentUser),
      profileAccess: canViewProfile(currentUser),
      suspended: isAccountSuspended(currentUser),
      accountActive: isAccountActive(currentUser),
    }),
    [
      data,
      currentUser,
      ready,
      login,
      logout,
      createLearner,
      reactivateAccount,
      blockUser,
      unblockUser,
      resetPassword,
      saveChapter,
      deleteChapter,
      saveQuestion,
      deleteQuestion,
      markChapterComplete,
      submitPractice,
      startMockExamQuestions,
      submitMockExam,
      resetDemoData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
