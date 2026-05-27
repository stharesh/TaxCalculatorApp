import { useState, useRef } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import FrequencyInput from '../FrequencyInput'
import CommonQuestions from '../CommonQuestions'
import ConfusedLink from '../ConfusedLink'

const QUESTIONS = [
  {
    q: "What is 'Basic Pay' — I don't see it on my slip?",
    a: "Basic Pay (or Basic Salary) is one line inside your salary slip. It's usually 40–50% of your total salary. Look for a table with 'Earnings' — Basic will be the first row. If you genuinely can't find it, enter 40% of your take-home as an estimate.",
  },
  {
    q: "My take-home changes every month. What do I enter?",
    a: "Enter your average month. Add up the last 3–4 months and divide by the number of months. A rough figure is fine — this calculator gives an estimate.",
  },
  {
    q: "Should I enter CTC or take-home?",
    a: "Take-home — the amount that lands in your bank account after all deductions. CTC includes EPF, gratuity and other amounts that never reach you directly and should not be entered here.",
  },
  {
    q: "I get monthly incentives. How do I enter them?",
    a: "Select 'Monthly' on the bonus field and enter one month's incentive. We'll calculate the annual total for you. Only include extra payouts — not your regular fixed salary.",
  },
  {
    q: "I have income from two jobs. What do I enter?",
    a: "Add both: combine the basic pay from both employers and enter the total. Do the same for take-home.",
  },
]

export default function S04_SalaryDetails({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  function validate() {
    const e = {}
    if (!data.takeHomeSalaryMonthly || Number(data.takeHomeSalaryMonthly) <= 0) {
      e.takeHome = 'Please enter your monthly take-home salary.'
    }
    if (!data.basicSalaryMonthly || Number(data.basicSalaryMonthly) <= 0) {
      e.basic = 'Please enter your basic pay.'
    }
    if (data.hasBonus === null) {
      e.hasBonus = 'Please answer this question.'
    }
    if (data.hasBonus === true && (!data.bonus || Number(data.bonus) <= 0)) {
      e.bonus = 'Please enter the bonus amount.'
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    goNext()
  }

  function clearError(key) {
    setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  const annualTakeHome = data.takeHomeSalaryMonthly ? Number(data.takeHomeSalaryMonthly) * 12 : 0
  const basicExceedsTakeHome = Number(data.basicSalaryMonthly) > 0 && Number(data.takeHomeSalaryMonthly) > 0 && Number(data.basicSalaryMonthly) > Number(data.takeHomeSalaryMonthly)
  const showSurchargeWarning = annualTakeHome > 5000000

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Salary Details">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">💰</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Your Salary</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">What does your salary look like?</h2>
          <p className="mt-1.5 text-sm text-gray-500">
            Check your salary slip — it has all these numbers.
          </p>
        </div>

        {/* Side-by-side salary inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Take-home first */}
          <div>
            <NumberInput
              id="takehome"
              label="💳 What lands in your bank every month?"
              value={data.takeHomeSalaryMonthly}
              onChange={v => { update({ takeHomeSalaryMonthly: v }); clearError('takeHome') }}
              placeholder="e.g. 85,000"
              hint="The amount credited to your bank account each month — not your CTC or gross salary."
              required
            />
            {errors.takeHome && <p role="alert" className="mt-1 text-xs text-red-600">{errors.takeHome}</p>}
          </div>

          {/* Basic salary */}
          <div>
            <NumberInput
              id="basic"
              label="📄 What does your slip show as Basic Pay?"
              value={data.basicSalaryMonthly}
              onChange={v => { update({ basicSalaryMonthly: v }); clearError('basic') }}
              placeholder="e.g. 40,000"
              hint="Usually 40–50% of total salary. First row under 'Earnings'."
              required
            />
            <div className="mt-1">
              <ConfusedLink faqRef={faqRef} label="Can't find Basic Pay?" />
            </div>
            {errors.basic && <p role="alert" className="mt-1 text-xs text-red-600">{errors.basic}</p>}
          </div>
        </div>

        {/* Live annual preview */}
        {annualTakeHome > 0 && (
          <div className="reveal px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <span className="text-xs text-indigo-700">Your annual take-home</span>
            <span className="text-sm font-bold text-indigo-800">
              ₹{annualTakeHome.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Basic > take-home warning */}
        {basicExceedsTakeHome && (
          <div className="reveal flex items-start gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Double-check:</strong> Your Basic Pay (₹{Number(data.basicSalaryMonthly).toLocaleString('en-IN')}) is higher than your take-home (₹{Number(data.takeHomeSalaryMonthly).toLocaleString('en-IN')}). Basic Pay is always a portion of your total salary, so it should be lower than what you receive in your bank. Please check your salary slip again.
            </p>
          </div>
        )}

        {/* Surcharge warning for high earners */}
        {showSurchargeWarning && (
          <div className="reveal flex items-start gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Heads up:</strong> Your annual income is above ₹50 lakh. Incomes above this level may attract a surcharge (an extra charge on top of your tax). This calculator does not include surcharge, so your actual tax may be slightly higher. Consider consulting a tax professional for an exact figure.
            </p>
          </div>
        )}

        {/* Bonus / Extra Income */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Do you get any extra money apart from your fixed monthly salary?
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              For example: bonus, performance pay, sales incentives, joining bonus, or any extra payout during the year.
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { val: true, label: 'Yes, I get extra money' },
              { val: false, label: 'No, my salary is fixed' },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => { update({ hasBonus: val, bonus: val ? data.bonus : '' }); clearError('hasBonus') }}
                className={`flex-1 py-2.5 px-2 rounded-xl border-2 text-sm font-semibold transition-all text-center leading-tight
                  ${data.hasBonus === val
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.hasBonus && <p role="alert" className="text-xs text-red-600">{errors.hasBonus}</p>}

          {data.hasBonus === true && (
            <div className="reveal space-y-3">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                <FrequencyInput
                  id="bonus"
                  label="How much extra do you receive in total?"
                  value={data.bonus}
                  onChange={v => { update({ bonus: v }); clearError('bonus') }}
                  placeholder="e.g. 50,000"
                  hint="Add up all bonuses, incentives and extra payouts you received (or expect) between April 2025 – March 2026."
                  required
                />
                {errors.bonus && <p role="alert" className="mt-1 text-xs text-red-600">{errors.bonus}</p>}

                {/* Not sure helper */}
                <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                  <p className="text-xs font-medium text-blue-800 mb-1">Not sure of the exact amount?</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Check your salary slips for any months where the credit was higher than usual — that difference is your bonus/incentive. Enter your best estimate; you can always come back and adjust.
                  </p>
                </div>

                {/* Don't include clarification */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  Don't include: your fixed monthly salary, HRA, or regular allowances — those are already covered above.
                </p>
              </div>

              {/* Estimated annual income preview */}
              {annualTakeHome > 0 && Number(data.bonus) > 0 && (
                <div className="reveal px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-green-700">Estimated annual income (salary + extra)</span>
                  <span className="text-sm font-bold text-green-800">
                    ₹{(annualTakeHome + Number(data.bonus)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          )}

          {data.hasBonus === false && (
            <div className="reveal p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 leading-relaxed">
                Got it — we'll use only your fixed monthly salary for the calculation.
              </p>
            </div>
          )}
        </div>

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
