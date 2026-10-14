import type { Question } from '../types'

export function QuestionSituation({
  question,
  compact = false,
}: {
  question: Pick<Question, 'stem' | 'imageUrl'>
  compact?: boolean
}) {
  const hasImage = Boolean(question.imageUrl)

  return (
    <div
      className={`grid gap-4 ${
        hasImage && !compact ? 'md:grid-cols-[minmax(0,220px)_1fr] md:items-start' : ''
      }`}
    >
      {hasImage ? (
        <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
          <img
            src={question.imageUrl!}
            alt="وضعية مرورية مرتبطة بالسؤال"
            className={`mx-auto w-full object-contain ${compact ? 'max-h-40' : 'max-h-56 md:max-h-64'} p-3`}
            loading="lazy"
          />
          <figcaption className="border-t border-line px-3 py-2 text-center text-xs text-muted">
            صورة توضيحية للوضعية
          </figcaption>
        </figure>
      ) : null}
      <p
        className={`font-bold leading-relaxed text-ink ${
          compact ? 'text-lg' : 'text-xl sm:text-2xl'
        }`}
      >
        {question.stem}
      </p>
    </div>
  )
}
