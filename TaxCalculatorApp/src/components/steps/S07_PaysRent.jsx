import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import CommonQuestions from '../CommonQuestions'

const QUESTIONS = [
  {
    q: "My father pays the rent, not me. Can I still claim?",
    a: "No. You can only claim HRA exemption if you personally pay the rent from your own account.",
  },
  {
    q: "I live in my parents' house and pay them rent.",
    a: "Only if you actually pay via bank transfer and have a written rent agreement. Cash payments are risky and harder to prove.",
  },
  {
    q: "I own a house in my hometown but rent where I work.",
    a: "Select Yes. You can claim HRA on rent paid even if you own a house in a different city.",
  },
]

export default function S07_PaysRent({ data, update, goNext, goBack, skipTo, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [error, setError] = useState('')

  function handleSelect(val) {
    update({ paysRent: val })
    setError('')
  }

  function handleNext() {
    if (data.paysRent === null) {
      setError('Please answer this question to continue.')
      return
    }
    if (data.paysRent === false) {
      // Skip S08 (Rent Details) entirely
      skipTo(9)
    } else {
      goNext()  // → S08
    }
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Housing">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">🏠</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Housing</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Do you live in a rented house and personally pay the rent?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            This determines whether you can claim HRA exemption under the old regime.
            The rent must be paid from your own bank account.
          </p>
        </div>

        <div className="flex gap-3">
          {[{ val: true, label: 'Yes, I pay rent' }, { val: false, label: "No, I don't pay rent" }].map(({ val, label }) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => handleSelect(val)}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                ${data.paysRent === val
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        {data.paysRent === false && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              No HRA exemption will be applied. If you have HRA on your salary slip, it will be fully taxable.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue →
        </button>

        <CommonQuestions questions={QUESTIONS} />
      </div>
    </StepWrapper>
  )
}
