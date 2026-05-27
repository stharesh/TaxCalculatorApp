import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

const CommonQuestions = forwardRef(function CommonQuestions({ questions }, ref) {
  const [open, setOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const containerRef = useRef(null)

  // Exposed method: open the accordion and scroll into view
  useImperativeHandle(ref, () => ({
    openAndScroll() {
      setOpen(true)
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 80)
    },
  }))

  if (!questions || questions.length === 0) return null

  return (
    <div ref={containerRef} className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          Common questions about this
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          {questions.map((item, i) => (
            <div key={i} className="bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium text-gray-700 pr-4 leading-snug">{item.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-3 reveal">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

export default CommonQuestions
