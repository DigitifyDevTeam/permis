import { useState, type FormEvent } from 'react'
import { Badge, Button, Card, Input, Label, PageHeader, Textarea } from '../../components/ui'
import { formatDate, uid } from '../../lib/utils'
import { useApp } from '../../store/AppContext'
import type { AnswerOption, Chapter, Question } from '../../types'

export function AdminDashboard() {
  const { data, resetDemoData } = useApp()
  const learners = data.users.filter((u) => u.role === 'LEARNER')
  const active = learners.filter((u) => u.status === 'ACTIVE')
  const suspended = learners.filter((u) => u.status === 'SUSPENDED')
  const recent = data.attempts.filter((a) => a.type === 'MOCK_EXAM').slice(0, 5)

  return (
    <div>
      <PageHeader
        title="لوحة الإدارة"
        subtitle="النواة الأساسية: الحسابات، الدروس، الأسئلة، وآخر نتائج الامتحان."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (window.confirm('إعادة ضبط بيانات العرض التجريبي؟')) resetDemoData()
            }}
          >
            إعادة ضبط العرض
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="text-sm text-muted">كل المتعلّمات</div>
          <div className="mt-2 text-3xl font-black">{learners.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-muted">حسابات نشطة</div>
          <div className="mt-2 text-3xl font-black text-brand">{active.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-muted">حسابات معلّقة</div>
          <div className="mt-2 text-3xl font-black text-accent">{suspended.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-muted">الأسئلة</div>
          <div className="mt-2 text-3xl font-black">{data.questions.length}</div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="font-bold">آخر نتائج الامتحان</h2>
          <div className="mt-4 space-y-3">
            {recent.length ? (
              recent.map((a) => {
                const user = data.users.find((u) => u.id === a.userId)
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-xl bg-surface px-3 py-2"
                  >
                    <div>
                      <div className="font-bold">{user?.fullName ?? '—'}</div>
                      <div className="text-xs text-muted">{formatDate(a.finishedAt)}</div>
                    </div>
                    <Badge tone={a.passed ? 'success' : 'danger'}>
                      {a.score}/{a.total}
                    </Badge>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted">لا نتائج بعد.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdminUsersPage() {
  const {
    data,
    createLearner,
    reactivateAccount,
    blockUser,
    unblockUser,
    resetPassword,
  } = useApp()
  const learners = data.users.filter((u) => u.role === 'LEARNER')
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function onCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const res = createLearner({ fullName, email, phone, password })
    if (!res.ok) {
      setError(res.error ?? 'تعذّر إنشاء الحساب')
      return
    }
    setSuccess(
      `تم إنشاء حساب نشط لـ 3 أشهر. سلّمي للمتعلّمة: ${email} / ${password}`,
    )
    setFullName('')
    setEmail('')
    setPhone('')
    setPassword('')
    setShowForm(false)
  }

  return (
    <div>
      <PageHeader
        title="المستعملون"
        subtitle="إنشاء حساب نشط · بعد 3 أشهر يصبح معلّقاً تلقائياً · إعادة تفعيل دون حذف."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'إغلاق' : 'إنشاء متعلّمة'}
          </Button>
        }
      />

      {success ? (
        <Card className="mb-4 border-emerald-200 bg-emerald-50 text-sm text-success">
          {success}
        </Card>
      ) : null}

      {showForm ? (
        <Card className="mb-4">
          <h3 className="mb-3 font-bold">إنشاء حساب متعلّمة (نشط 3 أشهر)</h3>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={onCreate}>
            <div>
              <Label>الاسم الكامل</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>اسم المستخدم / البريد</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>الهاتف</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <Label>كلمة المرور</Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            {error ? (
              <p className="sm:col-span-2 text-sm font-semibold text-danger">{error}</p>
            ) : null}
            <div className="sm:col-span-2">
              <Button type="submit">إنشاء حساب نشط</Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-3">
        {learners.map((user) => (
          <Card key={user.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold">{user.fullName}</h3>
                  {user.status === 'BLOCKED' ? (
                    <Badge tone="danger">محظور</Badge>
                  ) : user.status === 'SUSPENDED' ? (
                    <Badge tone="accent">معلّق</Badge>
                  ) : (
                    <Badge tone="success">نشط</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {user.email} · {user.phone}
                </p>
                <p className="mt-1 text-xs text-muted">
                  نهاية الفترة:{' '}
                  {user.subscriptionEndsAt
                    ? formatDate(user.subscriptionEndsAt)
                    : '—'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(user.status === 'SUSPENDED' || user.status === 'ACTIVE') && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => reactivateAccount(user.id)}
                  >
                    إعادة تفعيل 3 أشهر
                  </Button>
                )}
                {user.status === 'BLOCKED' ? (
                  <Button size="sm" variant="accent" onClick={() => unblockUser(user.id)}>
                    رفع الحظر
                  </Button>
                ) : (
                  <Button size="sm" variant="danger" onClick={() => blockUser(user.id)}>
                    حظر
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const pwd = window.prompt('كلمة مرور جديدة', 'changeme123')
                    if (pwd) resetPassword(user.id, pwd)
                  }}
                >
                  تصفير كلمة المرور
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AdminChaptersPage() {
  const { data, saveChapter, deleteChapter } = useApp()
  const [editing, setEditing] = useState<Chapter | null>(null)

  function startNew() {
    setEditing({
      id: uid('ch'),
      title: '',
      slug: `chapter-${Date.now()}`,
      order: data.chapters.length + 1,
      summary: '',
      body: '',
      coverEmoji: '📘',
      coverImage: '/situations/intersection.svg',
    })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    saveChapter(editing)
    setEditing(null)
  }

  return (
    <div>
      <PageHeader
        title="إدارة الدروس"
        action={<Button onClick={startNew}>فصل جديد</Button>}
      />
      {editing ? (
        <Card className="mb-4">
          <form className="grid gap-3" onSubmit={onSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>العنوان</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>الرمز / Emoji</Label>
                <Input
                  value={editing.coverEmoji}
                  onChange={(e) =>
                    setEditing({ ...editing, coverEmoji: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>رابط صورة الفصل</Label>
              <Input
                value={editing.coverImage ?? ''}
                onChange={(e) =>
                  setEditing({ ...editing, coverImage: e.target.value || null })
                }
                placeholder="/situations/stop.svg"
              />
            </div>
            <div>
              <Label>ملخص</Label>
              <Input
                value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>المحتوى</Label>
              <Textarea
                rows={8}
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">حفظ</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-3">
        {[...data.chapters]
          .sort((a, b) => a.order - b.order)
          .map((chapter) => (
            <Card
              key={chapter.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-bold">
                  {chapter.coverEmoji} {chapter.title}
                </div>
                <div className="text-sm text-muted">{chapter.summary}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(chapter)}>
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('حذف الفصل؟')) deleteChapter(chapter.id)
                  }}
                >
                  حذف
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}

function emptyQuestion(): Question {
  return {
    id: uid('q'),
    chapterId: null,
    stem: '',
    imageUrl: null,
    explanation: '',
    active: true,
    options: [
      { id: uid('opt'), text: '', isCorrect: true },
      { id: uid('opt'), text: '', isCorrect: false },
      { id: uid('opt'), text: '', isCorrect: false },
      { id: uid('opt'), text: '', isCorrect: false },
    ],
  }
}

export function AdminQuestionsPage() {
  const { data, saveQuestion, deleteQuestion } = useApp()
  const [editing, setEditing] = useState<Question | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    if (!editing.options.some((o) => o.isCorrect)) {
      window.alert('حدّدي جواباً صحيحاً واحداً على الأقل')
      return
    }
    saveQuestion(editing)
    setEditing(null)
  }

  function updateOption(id: string, patch: Partial<AnswerOption>) {
    if (!editing) return
    setEditing({
      ...editing,
      options: editing.options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    })
  }

  return (
    <div>
      <PageHeader
        title="بنك الأسئلة"
        subtitle={`${data.questions.length} سؤال جاهز للتمارين والامتحان`}
        action={<Button onClick={() => setEditing(emptyQuestion())}>سؤال جديد</Button>}
      />

      {editing ? (
        <Card className="mb-4">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>
              <Label>نص السؤال</Label>
              <Textarea
                rows={3}
                value={editing.stem}
                onChange={(e) => setEditing({ ...editing, stem: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>الفصل</Label>
              <select
                className="w-full rounded-xl border border-line bg-white px-4 py-3"
                value={editing.chapterId ?? ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    chapterId: e.target.value || null,
                  })
                }
              >
                <option value="">عام / بدون فصل</option>
                {data.chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>الخيارات (فعّلي الصحيح)</Label>
              {editing.options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) =>
                      updateOption(opt.id, { isCorrect: e.target.checked })
                    }
                  />
                  <Input
                    value={opt.text}
                    placeholder={`خيار ${idx + 1}`}
                    onChange={(e) => updateOption(opt.id, { text: e.target.value })}
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <Label>الشرح</Label>
              <Textarea
                rows={2}
                value={editing.explanation}
                onChange={(e) =>
                  setEditing({ ...editing, explanation: e.target.value })
                }
              />
            </div>
            <div>
              <Label>صورة الوضعية (رابط أو رفع ملف)</Label>
              <Input
                value={editing.imageUrl ?? ''}
                onChange={(e) =>
                  setEditing({ ...editing, imageUrl: e.target.value || null })
                }
                placeholder="/situations/intersection.svg"
                className="mb-2"
              />
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 1_500_000) {
                    window.alert('حجم الصورة كبير. الحد الأقصى حوالي 1.5MB')
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () => {
                    setEditing({
                      ...editing,
                      imageUrl: String(reader.result),
                    })
                  }
                  reader.readAsDataURL(file)
                }}
              />
              {editing.imageUrl ? (
                <img
                  src={editing.imageUrl}
                  alt=""
                  className="mt-2 h-28 w-full max-w-xs rounded-xl border border-line object-contain"
                />
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button type="submit">حفظ السؤال</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-3">
        {data.questions.map((q) => (
          <Card key={q.id}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-3">
                <img
                  src={q.imageUrl || '/situations/intersection.svg'}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg border border-line bg-surface object-contain"
                />
                <div>
                <p className="font-bold">{q.stem}</p>
                <p className="mt-1 text-xs text-muted">
                  {data.chapters.find((c) => c.id === q.chapterId)?.title ?? 'عام'} ·{' '}
                  {q.options.filter((o) => o.isCorrect).length} جواب صحيح
                </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(q)}>
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('حذف السؤال؟')) deleteQuestion(q.id)
                  }}
                >
                  حذف
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

