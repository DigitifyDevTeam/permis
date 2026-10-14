import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui'
import { useApp } from '../../store/AppContext'

export function CoursesPage() {
  const { data, currentUser, learningAccess, markChapterComplete } = useApp()
  if (!learningAccess) {
    return (
      <EmptyState
        title="الدروس غير متاحة"
        description="الحساب معلّق. يمكنك فقط فتح الأرشيف وحسابك."
        action={
          <Link to="/app/archive">
            <Button>أرشيف الامتحانات</Button>
          </Link>
        }
      />
    )
  }

  const chapters = [...data.chapters].sort((a, b) => a.order - b.order)
  const doneIds = new Set(
    data.progress
      .filter((p) => p.userId === currentUser?.id)
      .map((p) => p.chapterId),
  )

  return (
    <div>
      <PageHeader
        title="الدروس"
        subtitle="فصول بالعربية الفصحى — اقرئي ثم أكّدي الإتمام قبل التمارين."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              {chapter.coverImage ? (
                <img
                  src={chapter.coverImage}
                  alt=""
                  className="h-20 w-20 rounded-xl border border-line bg-surface object-contain p-1"
                />
              ) : (
                <div className="text-3xl">{chapter.coverEmoji}</div>
              )}
              {doneIds.has(chapter.id) ? (
                <Badge tone="success">مكتمل</Badge>
              ) : (
                <Badge tone="muted">فصل {chapter.order}</Badge>
              )}
            </div>
            <h2 className="mt-3 text-xl font-bold">{chapter.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{chapter.summary}</p>
            <div className="mt-4 flex gap-2">
              <Link to={`/app/courses/${chapter.slug}`} className="flex-1">
                <Button className="w-full">اقرأ الدرس</Button>
              </Link>
              {!doneIds.has(chapter.id) ? (
                <Button
                  variant="secondary"
                  onClick={() => markChapterComplete(chapter.id)}
                >
                  إتمام
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ChapterPage() {
  const { slug } = useParams()
  const { data, learningAccess, markChapterComplete, currentUser } = useApp()
  if (!learningAccess) return <Navigate to="/app/courses" replace />

  const chapter = data.chapters.find((c) => c.slug === slug)
  if (!chapter) {
    return (
      <EmptyState
        title="الفصل غير موجود"
        description="تحققي من الرابط أو عودي لقائمة الدروس."
        action={
          <Link to="/app/courses">
            <Button>الدروس</Button>
          </Link>
        }
      />
    )
  }

  const done = data.progress.some(
    (p) => p.userId === currentUser?.id && p.chapterId === chapter.id,
  )
  const chapterQuestions = data.questions
    .filter((q) => q.active && q.chapterId === chapter.id && q.imageUrl)
    .slice(0, 3)

  return (
    <div>
      <PageHeader
        title={chapter.title}
        subtitle={chapter.summary}
        action={
          <Link to="/app/courses">
            <Button variant="secondary">رجوع</Button>
          </Link>
        }
      />
      <Card className="prose-ar">
        {chapter.coverImage ? (
          <img
            src={chapter.coverImage}
            alt={`صورة توضيحية: ${chapter.title}`}
            className="mb-5 max-h-56 w-full rounded-2xl border border-line bg-surface object-contain p-4"
          />
        ) : (
          <div className="mb-4 text-4xl">{chapter.coverEmoji}</div>
        )}
        {chapter.body.split('\n').map((line, idx) => {
          if (line.startsWith('## '))
            return (
              <h2 key={idx} className="mt-6 text-2xl font-extrabold">
                {line.replace('## ', '')}
              </h2>
            )
          if (line.startsWith('### '))
            return (
              <h3 key={idx} className="mt-4 text-lg font-bold">
                {line.replace('### ', '')}
              </h3>
            )
          if (line.startsWith('- '))
            return (
              <li key={idx} className="mr-5 list-disc text-ink-soft">
                {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
              </li>
            )
          if (!line.trim()) return <div key={idx} className="h-2" />
          return (
            <p key={idx} className="leading-8 text-ink-soft">
              {line.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          )
        })}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-5">
          {!done ? (
            <Button onClick={() => markChapterComplete(chapter.id)}>
              تعليم كمكتمل
            </Button>
          ) : (
            <Badge tone="success">أُنجز هذا الفصل</Badge>
          )}
          <Link to={`/app/practice?chapter=${chapter.id}`}>
            <Button variant="accent">تمارين هذا الفصل</Button>
          </Link>
        </div>
      </Card>

      {chapterQuestions.length ? (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold">أمثلة بصرية من تمارين الفصل</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {chapterQuestions.map((q) => (
              <Card key={q.id} className="p-3">
                <img
                  src={q.imageUrl || '/situations/intersection.svg'}
                  alt=""
                  className="mb-2 h-28 w-full rounded-xl bg-surface object-contain"
                />
                <p className="line-clamp-3 text-sm font-semibold text-ink-soft">{q.stem}</p>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
