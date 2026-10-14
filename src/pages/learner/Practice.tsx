import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { QuestionSituation } from '../../components/QuestionSituation'
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui'
import { shuffle } from '../../lib/utils'
import { useApp } from '../../store/AppContext'
import type { Attempt, AttemptAnswer, Question } from '../../types'

export function PracticePage() {
  const { data, learningAccess, submitPractice } = useApp()
  const [params] = useSearchParams()
  const initialChapter = params.get('chapter')
  const [chapterId, setChapterId] = useState<string | 'all'>(initialChapter ?? 'all')
  const [quiz, setQuiz] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [answers, setAnswers] = useState<AttemptAnswer[]>([])
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState<Attempt | null>(null)

  const chapters = useMemo(
    () => [...data.chapters].sort((a, b) => a.order - b.order),
    [data.chapters],
  )

  if (!learningAccess) {
    return (
      <EmptyState
        title="التمارين غير متاحة"
        description="الحساب معلّق. التمارين متاحة فقط للحسابات النشطة."
        action={
          <Link to="/app/archive">
            <Button>أرشيف الامتحانات</Button>
          </Link>
        }
      />
    )
  }

  function start() {
    const pool = data.questions.filter(
      (q) =>
        q.active &&
        (chapterId === 'all' ? true : q.chapterId === chapterId),
    )
    const picked = shuffle(pool).slice(0, Math.min(10, pool.length))
    setQuiz(picked)
    setIndex(0)
    setSelected([])
    setAnswers([])
    setRevealed(false)
    setResult(null)
  }

  if (result) {
    return (
      <div>
        <PageHeader title="نتيجة التمرين" />
        <Card className="text-center">
          <div className="text-5xl font-black text-brand">
            {result.score}/{result.total}
          </div>
          <p className="mt-3 text-muted">أحسنتِ على إكمال التمرين. واصلي لتعزيز نقاط الضعف.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={start}>تمرين جديد</Button>
            <Button variant="secondary" onClick={() => setResult(null)}>
              رجوع
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div>
        <PageHeader
          title="التمارين"
          subtitle="10 أسئلة مع تصحيح فوري وشرح مختصر — تماماً بأسلوب التحضير للامتحان."
        />
        <Card className="max-w-xl space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">اختر الفصل</label>
            <select
              className="w-full rounded-xl border border-line bg-white px-4 py-3"
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
            >
              <option value="all">أسئلة متنوعة</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <Button size="lg" onClick={start}>
            ابدأ التمرين
          </Button>
        </Card>
      </div>
    )
  }

  if (!quiz.length) {
    return (
      <EmptyState
        title="لا أسئلة متاحة"
        description="أضيفي أسئلة من لوحة الإدارة لهذا الفصل."
        action={<Button onClick={() => setQuiz(null)}>رجوع</Button>}
      />
    )
  }

  const question = quiz[index]
  const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o.id)

  function toggle(optionId: string) {
    if (revealed) return
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    )
  }

  function reveal() {
    if (!selected.length) return
    setRevealed(true)
  }

  function next() {
    const entry: AttemptAnswer = {
      questionId: question.id,
      selectedOptionIds: selected,
      correct:
        selected.length === correctIds.length &&
        selected.every((id) => correctIds.includes(id)),
    }
    const nextAnswers = [...answers, entry]
    if (index >= quiz!.length - 1) {
      const attempt = submitPractice(
        chapterId === 'all' ? null : chapterId,
        nextAnswers,
      )
      setResult(attempt)
      setQuiz(null)
      return
    }
    setAnswers(nextAnswers)
    setIndex((i) => i + 1)
    setSelected([])
    setRevealed(false)
  }

  return (
    <div>
      <PageHeader
        title="تمرين تفاعلي"
        subtitle={`السؤال ${index + 1} من ${quiz.length}`}
        action={<Badge tone="brand">{Math.round(((index + (revealed ? 1 : 0)) / quiz.length) * 100)}%</Badge>}
      />
      <Card>
        <QuestionSituation question={question} />
        <div className="mt-5 space-y-3">
          {question.options.map((opt) => {
            const isSelected = selected.includes(opt.id)
            const showCorrect = revealed && opt.isCorrect
            const showWrong = revealed && isSelected && !opt.isCorrect
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className={`w-full rounded-xl border px-4 py-3 text-right font-semibold transition ${
                  showCorrect
                    ? 'border-success bg-emerald-50 text-success'
                    : showWrong
                      ? 'border-danger bg-red-50 text-danger'
                      : isSelected
                        ? 'border-brand bg-teal-50 text-brand'
                        : 'border-line bg-surface hover:border-brand/40'
                }`}
              >
                {opt.text}
              </button>
            )
          })}
        </div>
        {revealed ? (
          <div className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm text-amber-950">
            <strong>الشرح: </strong>
            {question.explanation}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {!revealed ? (
            <Button onClick={reveal} disabled={!selected.length}>
              التحقق من الإجابة
            </Button>
          ) : (
            <Button onClick={next}>
              {index >= quiz.length - 1 ? 'إنهاء التمرين' : 'التالي'}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setQuiz(null)}>
            إلغاء
          </Button>
        </div>
      </Card>
    </div>
  )
}
