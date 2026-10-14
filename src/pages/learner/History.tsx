import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui'
import { formatDate } from '../../lib/utils'
import { useApp } from '../../store/AppContext'

export function ArchivePage() {
  const { currentUser, data, archiveAccess, learningAccess } = useApp()
  if (!archiveAccess) return <Navigate to="/login" replace />

  const attempts = data.attempts.filter(
    (a) => a.userId === currentUser?.id && a.type === 'MOCK_EXAM',
  )

  return (
    <div>
      <PageHeader
        title="أرشيف الامتحانات"
        subtitle="امتحاناتك السابقة تبقى حتى لو أصبح الحساب معلّقاً."
      />
      {!attempts.length ? (
        <EmptyState
          title="لا نتائج في الأرشيف"
          description="بعد أول امتحان تجريبي ستظهر النتائج هنا."
          action={
            learningAccess ? (
              <Link to="/app/exam">
                <Button>بدء امتحان</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <Card
              key={attempt.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-xl font-black">
                  {attempt.score}/{attempt.total}
                </div>
                <div className="text-sm text-muted">{formatDate(attempt.finishedAt)}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={attempt.passed ? 'success' : 'danger'}>
                  {attempt.passed ? 'نجاح' : 'لم تنجحي'}
                </Badge>
                <Link to={`/app/exam/result/${attempt.id}`}>
                  <Button size="sm" variant="secondary">
                    التفاصيل
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export function ExamResultPage() {
  const { id } = useParams()
  const { currentUser, data, archiveAccess } = useApp()
  if (!archiveAccess) return <Navigate to="/login" replace />

  const attempt = data.attempts.find(
    (a) => a.id === id && a.userId === currentUser?.id,
  )
  if (!attempt) {
    return (
      <EmptyState
        title="النتيجة غير موجودة"
        description="تحققي من الرابط."
        action={
          <Link to="/app/archive">
            <Button>الأرشيف</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="نتيجة الامتحان"
        action={
          <Link to="/app/archive">
            <Button variant="secondary">الأرشيف</Button>
          </Link>
        }
      />
      <Card className="overflow-hidden text-center">
        <div
          className={`animate-fade-up mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full text-3xl font-black text-white ${
            attempt.passed ? 'bg-success' : 'bg-danger'
          }`}
        >
          {attempt.score}
        </div>
        <h2 className="text-2xl font-extrabold">
          {attempt.passed ? 'مبروك! نجحتِ في الامتحان التجريبي' : 'حظاً أوفر — أعيدي المحاولة'}
        </h2>
        <p className="mt-2 text-muted">
          {attempt.score}/{attempt.total} من الإجابات الصحيحة · النجاح من{' '}
          {data.settings.passThreshold}/{data.settings.questionCount} (بحد أقصى{' '}
          {data.settings.questionCount - data.settings.passThreshold} أخطاء)
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!attempt.passed ? (
            <Link to="/app/exam">
              <Button size="lg">إعادة الامتحان</Button>
            </Link>
          ) : null}
          <Link to="/app/practice">
            <Button variant="secondary" size="lg">
              تمارين إضافية
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export function ProfilePage() {
  const { currentUser, data, learningAccess, suspended, profileAccess, logout } =
    useApp()
  if (!currentUser || !profileAccess) return <Navigate to="/login" replace />

  return (
    <div>
      <PageHeader title="حسابي" subtitle="عرض بياناتك وحالة الحساب فقط." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">البيانات الشخصية</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-2">
              <dt className="text-muted">الاسم</dt>
              <dd className="font-bold">{currentUser.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-2">
              <dt className="text-muted">اسم المستخدم</dt>
              <dd className="font-bold">{currentUser.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-2">
              <dt className="text-muted">الهاتف</dt>
              <dd className="font-bold">{currentUser.phone}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">حالة الحساب</h2>
          <div className="mt-4">
            {learningAccess ? (
              <Badge tone="success">نشط</Badge>
            ) : suspended ? (
              <Badge tone="accent">معلّق — غير محذوف</Badge>
            ) : (
              <Badge tone="muted">غير متاح</Badge>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            مدة النشاط {data.settings.subscriptionMonths} أشهر. بعد انتهائها يصبح الحساب
            معلّقاً (ليس محذوفاً): أرشيف الامتحانات وحسابك فقط. لإعادة التفعيل تواصلي مع
            الإدارة.
          </p>
          {suspended ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-accent-soft p-4 text-sm">
              <div className="font-bold">إعادة التفعيل</div>
              <p className="mt-1 text-amber-950">
                تواصلي مع الإدارة على {data.settings.contactPhone}. بعد استلام الرسوم خارج
                المنصة، يعيد المدير تفعيل حسابك لمدة 3 أشهر جديدة.
              </p>
              <Link to="/app/archive" className="mt-2 inline-block font-bold underline">
                فتح أرشيف الامتحانات
              </Link>
            </div>
          ) : null}
          <Button variant="secondary" className="mt-6" onClick={logout}>
            تسجيل الخروج
          </Button>
        </Card>
      </div>
    </div>
  )
}
