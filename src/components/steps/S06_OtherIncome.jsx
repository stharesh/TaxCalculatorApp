import { useState, useRef } from 'react'
import StepWrapper from '../StepWrapper'
import FrequencyInput from '../FrequencyInput'
import CommonQuestions from '../CommonQuestions'
import ConfusedLink from '../ConfusedLink'

const QUESTIONS = [
  {
    q: "What is FD interest? Where do I find this number?",
    a: "When you keep money in a Fixed Deposit, the bank pays you interest every quarter or year. Check your bank's passbook or app under 'Interest credited'. You can also see it in your Form 26AS on the income tax portal.",
  },
  {
    q: "What is savings account interest?",
    a: "Your regular bank savings account earns a small interest (usually 2–4% per year) on the balance you maintain. Banks credit this every quarter. Check your bank statement — search for entries labelled 'Interest Credit'.",
  },
  {
    q: "My bank already deducted TDS on my FD interest. Do I still count it?",
    a: "Yes. TDS is just an advance payment of tax. The full interest amount is still your income and must be declared here.",
  },
  {
    q: "The FD is in my spouse's or parent's name. Do I include it?",
    a: "No. Only include interest from FDs and accounts in your own name.",
  },
  {
    q: "Does PPF interest count?",
    a: "No. PPF interest is completely tax-free and does not need to be declared anywhere.",
  },
  {
    q: "I don't know the exact interest amount. What do I do?",
    a: "Open your bank app and check your statement for entries like 'Int Pd' or 'Interest Credit'. Add up all such credits during the year. Even a rough estimate helps — you can correct it when you file your actual return.",
  },
]

export default function S06_OtherIncome({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  function handleNext() {
    const e = {}
    if (data.hasOtherIncome === null) {
      e.hasOtherIncome = 'Please answer this question.'
    }
    if (Object.keys(e).length > 0) { setErrors(e); return }
    if (!data.hasOtherIncome) {
      update({ fdInterest: '', savingsInterest: '' })
    }
    goNext()
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Other Income">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">💵</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Other Income</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Did your bank pay you any interest this year?
          </h2>
          <div className="mt-1.5 space-y-1">
            <p className="text-sm text-gray-500">
              Interest from Fixed Deposits (FD) and Savings accounts is added to your income and taxed. Many people forget this.
            </p>
            <ConfusedLink faqRef={faqRef} label="What counts as interest income?" />
          </div>
        </div>

        {/* What-is explainer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-700">🏦 Fixed Deposit (FD)</p>
            <p className="text-xs text-gray-500 mt-1">Interest earned on money locked in an FD for 1–5 years. Check your bank statement or call the bank.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-700">💳 Savings Account</p>
            <p className="text-xs text-gray-500 mt-1">The small interest your bank pays on the balance in your regular account. Usually ₹500–₹5,000 per year.</p>
          </div>
        </div>

        {/* Yes/No */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Did you earn any interest from FDs or savings accounts in FY 2025-26?
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </p>
          <div className="flex gap-3">
            {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(({ val, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => { update({ hasOtherIncome: val }); setErrors({}) }}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                  ${data.hasOtherIncome === val
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.hasOtherIncome && <p role="alert" className="text-xs text-red-600">{errors.hasOtherIncome}</p>}
        </div>

        {/* Conditional inputs */}
        {data.hasOtherIncome === true && (
          <div className="reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div>
              <FrequencyInput
                id="fdInterest"
                label="Interest from Fixed Deposits"
                value={data.fdInterest}
                onChange={v => update({ fdInterest: v })}
                placeholder="0"
                hint="Add all FDs together. Enter 0 if you have no FDs."
              />
            </div>
            <div>
              <FrequencyInput
                id="savingsInterest"
                label="Interest from Savings Bank accounts"
                value={data.savingsInterest}
                onChange={v => update({ savingsInterest: v })}
                placeholder="0"
                hint="Usually a small amount. Check your annual bank statement. Enter 0 if negligible."
              />
            </div>
            <p className="text-xs text-blue-700">
              Tip: open your bank app → Statements → search for "Interest Credit" entries.
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

        <CommonQuestions ref={faqRef} questions={QUESTIONS} />
      </div>
    </StepWrapper>
  )
}
