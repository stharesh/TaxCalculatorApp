import { useEffect, useRef, useState } from 'react'
import { computeTax } from '../../taxEngine'

const STEPS = [
  'Adding up all your income',
  'Applying your salary components',
  'Computing old regime with all deductions',
  'Computing new regime',
  'Comparing both regimes',
  'Finding the best option for you',
]

export default function S13_Calculating({ data, goNext, setResults }) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const started = useRef(false)

  useEffect(() => {
    // Guard against React StrictMode double-invoke
    if (started.current) return
    started.current = true

    // Animate through steps
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i > 0) {
          setDoneSteps(prev => [...prev, i - 1])
        }
      }, i * 380)
    })

    // Compute and advance after animation
    const totalDelay = STEPS.length * 380 + 300
    setTimeout(() => {
      setDoneSteps(STEPS.map((_, i) => i))  // mark all done
      const results = computeTax(data)
      setResults(results)
      setTimeout(goNext, 400)
    }, totalDelay)
  }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" aria-hidden="true" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Crunching your numbers...</h2>
          <p className="text-sm text-gray-500 mt-1">This will take just a moment</p>
        </div>

        {/* Step list */}
        <div className="space-y-3">
          {STEPS.map((label, i) => {
            const done = doneSteps.includes(i)
            const active = activeStep === i && !done
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  i > activeStep ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {/* Status icon */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                  ${done ? 'bg-green-500' : active ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  aria-hidden="true"
                >
                  {done ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : active ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  )}
                </div>
                <span className={`text-sm ${done ? 'text-green-700 font-medium' : active ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
