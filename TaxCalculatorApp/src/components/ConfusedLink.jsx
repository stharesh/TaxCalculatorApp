/**
 * Inline "Confused?" link. Pass the faqRef from the parent screen.
 * On click, opens the CommonQuestions accordion and scrolls to it.
 */
export default function ConfusedLink({ faqRef, label = 'Not sure? See examples' }) {
  function handleClick(e) {
    e.preventDefault()
    faqRef?.current?.openAndScroll()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 underline decoration-dotted underline-offset-2 transition-colors"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {label}
    </button>
  )
}
