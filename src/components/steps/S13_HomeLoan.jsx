import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

const QUESTIONS = [
  {
    q: "Loan is in my father's name but I pay the EMI. Can I claim?",
    a: "No. The loan must be in your name or jointly in your name for you to claim the deduction.",
  },
  {
    q: "I have two home loans. Can I add both?",
    a: "Yes, add both interest amounts together. But the total cap is still ₹2,00,000 regardless.",
  },
  {
    q: "How do I know the interest vs principal split?",
    a: "Your bank sends a home loan interest certificate every year, usually around April. Check your email or bank's online portal.",
  },
  {
    q: "My house is under construction. Does the interest count?",
    a: "Not yet. Only completed, occupied properties qualify for Section 24(b) deduction.",
  },
  {
    q: "Can I claim both HRA and home loan interest?",
    a: "Yes. If you own a house in one city but rent in another city for work, you can claim both HRA on rent paid and home loan interest on your own house.",
  },
]

const OWNERSHIP_OPTIONS = [
  { value: 'own', label: 'In my name only' },
  { value: 'joint', label: 'Joint with spouse or co-borrower' },
  { value: 'other', label: "In someone else's name" },
]

export default function S11_HomeLoan({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (data.hasHomeLoan === null) {
      e.hasHomeLoan = 'Please answer this question.'
    }
    if (data.hasHomeLoan && !data.loanOwnership) {
      e.loanOwnership = 'Please select the loan ownership.'
    }
    if (data.hasHomeLoan && data.loanOwnership && data.loanOwnership !== 'other') {
      if (!data.homeLoanInterest || Number(data.homeLoanInterest) <= 0) {
        e.homeLoanInterest = 'Please enter the interest paid.'
      }
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    goNext()
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Home Loan">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">🏡</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Home Loan</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Do you have a home loan for a house you currently live in?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Home loan interest reduces taxable income under old regime only.
            <span className="block mt-1 text-xs text-gray-400">Section 24(b) — max ₹2,00,000 for self-occupied property</span>
          </p>
        </div>

        {/* Yes/No */}
        <div className="space-y-3">
          <div className="flex gap-3">
            {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(({ val, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => { update({ hasHomeLoan: val, loanOwnership: null, homeLoanInterest: '' }); setErrors({}) }}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                  ${data.hasHomeLoan === val
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.hasHomeLoan && <p role="alert" className="text-xs text-red-600">{errors.hasHomeLoan}</p>}
        </div>

        {data.hasHomeLoan === true && (
          <div className="space-y-5">
            {/* Ownership */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Is this loan in your name?
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              </legend>
              <div className="space-y-2">
                {OWNERSHIP_OPTIONS.map(opt => {
                  const selected = data.loanOwnership === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="loanOwnership"
                        value={opt.value}
                        checked={selected}
                        onChange={() => { update({ loanOwnership: opt.value, homeLoanInterest: '' }); setErrors(p => ({ ...p, loanOwnership: undefined, homeLoanInterest: undefined })) }}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}
                        aria-hidden="true"
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={`text-sm font-medium ${selected ? 'text-indigo-900' : 'text-gray-900'}`}>{opt.label}</span>
                    </label>
                  )
                })}
              </div>
              {errors.loanOwnership && <p role="alert" className="mt-1 text-xs text-red-600">{errors.loanOwnership}</p>}
            </fieldset>

            {/* Someone else's name — info */}
            {data.loanOwnership === 'other' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 font-medium">You cannot claim this deduction.</p>
                <p className="text-xs text-amber-700 mt-1">
                  Section 24(b) requires the loan to be in your name or jointly in your name.
                  The deduction will be skipped.
                </p>
              </div>
            )}

            {/* Interest amount — for own or joint */}
            {(data.loanOwnership === 'own' || data.loanOwnership === 'joint') && (
              <div>
                <NumberInput
                  id="homeLoanInterest"
                  label="How much interest did you pay on this home loan last year?"
                  value={data.homeLoanInterest}
                  onChange={v => { update({ homeLoanInterest: v }); setErrors(p => ({ ...p, homeLoanInterest: undefined })) }}
                  placeholder="e.g. 1,80,000"
                  note="Cap: ₹2,00,000. Check your bank's home loan interest certificate."
                  hint={data.loanOwnership === 'joint'
                    ? "Enter only your share — typically 50% of total interest. Each co-borrower can claim up to ₹2,00,000."
                    : undefined}
                  required
                />
                {errors.homeLoanInterest && <p role="alert" className="mt-1 text-xs text-red-600">{errors.homeLoanInterest}</p>}
              </div>
            )}
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
