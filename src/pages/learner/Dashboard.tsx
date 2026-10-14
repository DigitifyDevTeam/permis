import { Link } from 'react-router-dom'
import { Badge, Button, Card, PageHeader, ProgressBar } from '../../components/ui'
import { daysLeft, formatDate } from '../../lib/utils'
import { useApp } from '../../store/AppContext'

export function LearnerDashboard() {
  const { currentUser, data, learningAccess, suspended } = useApp()
  const chapters = [...data.chapters].sort((a, b) => a.order - b.order)
  const done = data.progress.filter((p) => p.userId === currentUser?.id)
  const progress = chapters.length
    ? Math.round((done.length / chapters.length) * 100)
    : 0
  const exams = data.attempts.filter(
    (a) => a.userId === currentUser?.id && a.type === 'MOCK_EXAM',
  )
  const best = exams.reduce((m, a) => Math.max(m, a.score), 0)
  const left = daysLeft(currentUser?.subscriptionEndsAt ?? null)

  return (
    <div>
      <PageHeader
        title={`أهلاً ${currentUser?.fullName?.split(' ')[0] ?? ''}`}
        subtitle="متابعة التقدّم والاستعداد للامتحان التجريبي."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-muted">إنجاز الدروس</div>
          <div className="mt-2 text-3xl font-black text-brand">{progress}%</div>
          <div className="mt-3">
            <ProgressBar value={progress} />
          </div>
          <div className="mt-2 text-xs text-muted">
            {done.length} من {chapters.length} فصل مكتمل
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted">أفضل نتيجة امتحان</div>
          <div className="mt-2 text-3xl font-black">
            {exams.length ? `${best}/${data.settings.questionCount}` : '—'}
          </div>
          <div className="mt-3">
            {exams[0]?.passed ? (
              <Badge tone="success">آخر محاولة ناجحة</Badge>
            ) : exams.length ? (
              <Badge tone="accent">يُنصح بمزيد من التدريب</Badge>
            ) : (
              <Badge tone="muted">لم تجتازي امتحاناً بعد</Badge>
            )}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted">حالة الحساب</div>
          <div className="mt-2 text-3xl font-black">
            {learningAccess ? `${left ?? 0}` : suspended ? '0' : '—'}
          </div>
          <div className="mt-1 text-sm text-muted">
            {learningAccess
              ? 'يوماً متبقياً'
              : suspended
                ? 'معلّق — أرشيف فقط'
                : 'غير متاح'}
          </div>
          {currentUser?.subscriptionEndsAt ? (
            <div className="mt-2 text-xs text-muted">
              حتى {formatDate(currentUser.subscriptionEndsAt)}
            </div>
          ) : null}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">ماذا بعد؟</h2>
          <div className="mt-4 space-y-3">
            <Link to="/app/courses" className="block">
              <Button className="w-full" disabled={!learningAccess}>
                متابعة الدروس
              </Button>
            </Link>
            <Link to="/app/practice" className="block">
              <Button variant="secondary" className="w-full" disabled={!learningAccess}>
                تمرين سريع
              </Button>
            </Link>
            <Link to="/app/exam" className="block">
              <Button variant="accent" className="w-full" disabled={!learningAccess}>
                بدء امتحان تجريبي
              </Button>
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">آخر النتائج</h2>
          <div className="mt-4 space-y-3">
            {exams.slice(0, 4).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2"
              >
                <div>
                  <div className="font-bold">
                    {exam.score}/{exam.total}
                  </div>
                  <div className="text-xs text-muted">{formatDate(exam.finishedAt)}</div>
                </div>
                <Badge tone={exam.passed ? 'success' : 'danger'}>
                  {exam.passed ? 'نجاح' : 'إعادة'}
                </Badge>
              </div>
            ))}
            {!exams.length ? (
              <p className="text-sm text-muted">لا توجد محاولات بعد. ابدأ أول امتحان تجريبي.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
