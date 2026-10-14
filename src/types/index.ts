export type Role = 'LEARNER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BLOCKED'
export type AttemptType = 'PRACTICE' | 'MOCK_EXAM'

export interface User {
  id: string
  email: string
  password: string
  fullName: string
  phone: string
  role: Role
  status: UserStatus
  subscriptionEndsAt: string | null
  createdAt: string
}

export interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  chapterId: string | null
  stem: string
  imageUrl: string | null
  explanation: string
  active: boolean
  options: AnswerOption[]
}

export interface Chapter {
  id: string
  title: string
  slug: string
  order: number
  summary: string
  body: string
  coverEmoji: string
  coverImage: string | null
}

export interface LessonProgress {
  userId: string
  chapterId: string
  completedAt: string
}

export interface AttemptAnswer {
  questionId: string
  selectedOptionIds: string[]
  correct: boolean
}

export interface Attempt {
  id: string
  userId: string
  type: AttemptType
  chapterId: string | null
  score: number
  total: number
  passed: boolean
  answers: AttemptAnswer[]
  startedAt: string
  finishedAt: string
}

export interface PlatformSettings {
  platformName: string
  passThreshold: number
  questionCount: number
  subscriptionMonths: number
  examMinutes: number
  contactPhone: string
}

export interface AppData {
  users: User[]
  chapters: Chapter[]
  questions: Question[]
  progress: LessonProgress[]
  attempts: Attempt[]
  settings: PlatformSettings
}
