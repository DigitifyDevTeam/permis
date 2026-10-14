import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui'
import { useApp } from '../../store/AppContext'
import type { AttemptAnswer, Question } from '../../types'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

function CircularTimer({
  secondsLeft,
  totalSeconds,
}: {
  secondsLeft: number
  totalSeconds: number
}) {
  const size = 112
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = totalSeconds > 0 ? Math.max(0, secondsLeft / totalSeconds) : 0
  const offset = circumference * (1 - ratio)
  const urgent = secondsLeft <= 5

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-line"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={urgent ? 'text-danger' : 'text-brand'}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div
            className={`text-3xl font-black leading-none ${
              urgent ? 'text-danger' : 'text-ink'
            }`}
          >
            {secondsLeft}
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-wide text-muted">
            ثانية
          </div>
        </div>
      </div>
    </div>
  )
}

export function ExamPage() {
  const {
    data,
    learningAccess,
    startMockExamQuestions,
    submitMockExam,
  } = useApp()
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [answers, setAnswers] = useState<AttemptAnswer[]>([])
  const [startedAt, setStartedAt] = useState('')
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState(0)
  const timedOutForQuestion = useRef<string | null>(null)

  const perQuestionSeconds = useMemo(() => {
    const count = Math.max(1, data.settings.questionCount)
    return Math.max(15, Math.floor((data.settings.examMinutes * 60) / count))
  }, [data.settings.examMinutes, data.settings.questionCount])

  const question = questions[index]

  useEffect(() => {
    if (!started || !question) return
    if (questionSecondsLeft <= 0) return
    const t = window.setInterval(() => {
      setQuestionSecondsLeft((s) => s - 1)
    }, 1000)
    return () => window.clearInterval(t)
  }, [started, question, questionSecondsLeft])

  useEffect(() => {
    if (!started || !question) return
    if (questionSecondsLeft !== 0) return
    if (timedOutForQuestion.current === question.id) return
    timedOutForQuestion.current = question.id
    advance(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionSecondsLeft, question?.id, started])

  if (!learningAccess) {
    return (
      <EmptyState
        title="امتحان جديد غير متاح"
        description="الحساب معلّق. يمكنك عرض أرشيف الامتحانات فقط."
        action={
          <Link to="/app/archive">
            <Button>فتح الأرشيف</Button>
          </Link>
        }
      />
    )
  }

  function currentAnswer(optionIds: string[]): AttemptAnswer | null {
    if (!question) return null
    return {
      questionId: question.id,
      selectedOptionIds: optionIds,
      correct: false,
    }
  }

  function start() {
    const qs = startMockExamQuestions()
    timedOutForQuestion.current = null
    setQuestions(qs)
    setIndex(0)
    setSelected([])
    setAnswers([])
    setStarted(true)
    setStartedAt(new Date().toISOString())
    setQuestionSecondsLeft(perQuestionSeconds)
  }

  function toggle(optionId: string) {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    )
  }

  function finish(finalAnswers: AttemptAnswer[]) {
    const cleaned = finalAnswers.filter(Boolean)
    const attempt = submitMockExam(cleaned, startedAt || new Date().toISOString())
    setStarted(false)
    if (attempt) navigate(`/app/exam/result/${attempt.id}`)
  }

  function advance(optionIds: string[]) {
    const entry = currentAnswer(optionIds)
    if (!entry) return
    const nextAnswers = [...answers, entry]
    if (index >= questions.length - 1) {
      finish(nextAnswers)
      return
    }
    setAnswers(nextAnswers)
    setIndex((i) => i + 1)
    setSelected([])
    setQuestionSecondsLeft(perQuestionSeconds)
  }

  function validate() {
    if (!selected.length) return
    advance(selected)
  }

  if (!started) {
    return (
      <div>
        <PageHeader
          title="الامتحان التجريبي"
          subtitle={`امتحان تجريبي: ${data.settings.questionCount} سؤالاً، النجاح من ${data.settings.passThreshold}/${data.settings.questionCount} (بحد أقصى ${data.settings.questionCount - data.settings.passThreshold} أخطاء).`}
        />
        <Card className="max-w-2xl">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface p-4">
              <div className="text-2xl font-black text-brand">
                {data.settings.questionCount}
              </div>
              <div className="text-sm text-muted">سؤال</div>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <div className="text-2xl font-black text-brand">
                {data.settings.passThreshold}
              </div>
              <div className="text-sm text-muted">إجابة صحيحة للنجاح</div>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <div className="text-2xl font-black text-brand">
                {data.settings.questionCount - data.settings.passThreshold}
              </div>
              <div className="text-sm text-muted">حد أقصى للأخطاء</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            النجاح يتطلب {data.settings.passThreshold}/{data.settings.questionCount} من
            الإجابات الصحيحة، وبحد أقصى{' '}
            {data.settings.questionCount - data.settings.passThreshold} أخطاء. يمكنك إعادة
            الامتحان بلا حدود طالما الحساب نشط.
          </p>
          <Button className="mt-6" size="lg" onClick={start}>
            ابدئي الامتحان الآن
          </Button>
        </Card>
      </div>
    )
  }

  if (!question) {
    return (
      <EmptyState
        title="لا تكفي الأسئلة"
        description={`أضيفي المزيد من الأسئلة من لوحة الإدارة لإكمال امتحان ${data.settings.questionCount} سؤالاً.`}
        action={<Button onClick={() => setStarted(false)}>رجوع</Button>}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[linear-gradient(160deg,#0b1f1c_0%,#134e4a_45%,#0f766e_100%)]">
      <div className="border-b border-white/10 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-white">
          <div className="font-extrabold">{data.settings.platformName} · قانون المرور</div>
          <button
            type="button"
            className="text-sm font-bold text-accent hover:underline"
            onClick={() => {
              if (window.confirm('هل تريدين إنهاء الامتحان الآن؟')) {
                const entry = currentAnswer(selected)
                finish(entry ? [...answers, entry] : answers)
              }
            }}
          >
            « رجوع
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-6 lg:py-6">
        {/* Mobile/tablet status strip — mirrors codepermis stacked layout */}
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-lg lg:hidden">
          <CircularTimer
            secondsLeft={questionSecondsLeft}
            totalSeconds={perQuestionSeconds}
          />
          <div className="text-left">
            <div className="text-xs font-bold tracking-wide text-muted">QUESTION</div>
            <div className="text-3xl font-black text-brand">
              {index + 1}/{questions.length}
            </div>
          </div>
        </div>

        {/* Main question panel: image (optional) → stem → options → Valider */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {question.imageUrl ? (
            <figure className="border-b border-line bg-surface">
              <img
                src={question.imageUrl}
                alt="وضعية مرورية مرتبطة بالسؤال"
                className="mx-auto max-h-[360px] w-full object-cover sm:max-h-[420px]"
              />
            </figure>
          ) : null}

          <div className="space-y-5 p-5 sm:p-6">
            <h2 className="text-xl font-extrabold leading-relaxed text-brand sm:text-2xl">
              {question.stem}
            </h2>

            <p className="text-xs text-muted">يمكن اختيار أكثر من جواب إن لزم.</p>

            <ul className="space-y-3">
              {question.options.map((opt, i) => {
                const letter = OPTION_LETTERS[i] ?? String(i + 1)
                const active = selected.includes(opt.id)
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => toggle(opt.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-right transition ${
                        active
                          ? 'border-brand bg-teal-50 shadow-sm'
                          : 'border-line bg-white hover:border-brand/30'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black ${
                          active
                            ? 'bg-brand text-white'
                            : 'bg-surface text-muted ring-1 ring-line'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 text-base font-semibold text-ink">
                        {opt.text}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Badge tone="muted">
                سؤال {index + 1} من {questions.length}
              </Badge>
              <Button
                size="lg"
                className="min-w-[160px]"
                onClick={validate}
                disabled={!selected.length}
              >
                تأكيد
              </Button>
            </div>
          </div>
        </section>

        {/* Desktop sidebar: timer + question counter */}
        <aside className="hidden space-y-4 lg:block">
          <div className="grid place-items-center rounded-2xl bg-white p-5 shadow-xl">
            <CircularTimer
              secondsLeft={questionSecondsLeft}
              totalSeconds={perQuestionSeconds}
            />
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-xl">
            <div className="text-xs font-bold tracking-wide text-muted">QUESTION</div>
            <div className="mt-2 text-4xl font-black text-brand">
              {index + 1}/{questions.length}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => {
              if (window.confirm('هل تريدين إنهاء الامتحان الآن؟')) {
                const entry = currentAnswer(selected)
                finish(entry ? [...answers, entry] : answers)
              }
            }}
          >
            إنهاء مبكر
          </Button>
        </aside>
      </div>
    </div>
  )
}
