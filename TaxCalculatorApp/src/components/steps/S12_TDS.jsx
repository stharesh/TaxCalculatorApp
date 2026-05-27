import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

const QUESTIONS = [
  {
    q: "I'm not sure if my employer deducts TDS. How do I find out?",
    a: "Look at your monthly salary slip. There will be a line that says 'TDS', 'Income Tax' or 'IT Deduction'. If you see a non-zero number there, your employer is deducting TDS. If you've never seen such a line, select No.",
  },
  {
    q: "What exactly is TDS? I've heard of it but don't fully understand it.",
    a: "TDS stands for Tax Deducted at Source. Every month, your employer estimates how much total tax you'll owe for the year, divides it by 12, and deducts that amount from your salary before crediting it to you. They pay that money to the government on your behalf. Think of it as paying tax in monthly instalments automatically.",
  },
  {
    q: "Is TDS the same as my final income tax?",
    a: "No. TDS is just an estimate — your employer's best guess at your tax. This calculator will tell you the exact amount. If TDS was too high, you get a refund. If TDS was too low, you pay the difference when you file your return.",
  },
  {
    q: "My salary slip shows TDS of ₹0. Does that mean no tax was deducted?",
    a: "Yes. If TDS shows ₹0 on every slip, your employer either didn't deduct tax (perhaps because your income was below the taxable limit) or is deducting it differently. Select No in this case.",
  },
  {
    q: "I don't have my Form 16 yet. What do I enter?",
    a: "Form 16 is issued by your employer after March 31. If you don't have it yet, add up the TDS column from your monthly salary slips. Or you can enter 0 for now and revisit once you get Form 16.",
  },
  {
    q: "How do I find the exact TDS amount?",
    a: "Three ways: (1) Add up the TDS line from each of your 12 monthly salary slips. (2) Check your Form 16 Part A — it shows total TDS deposited. (3) Log in to incometax.gov.in, go to 'View 26AS / AIS', and look at the tax deducted section.",
  },
  {
    q: "I worked at two companies this year. What do I enter?",
    a: "Add the TDS deducted by both employers and enter the combined total. Your Form 16 from each employer will show their respective amounts.",
  },
]

export default function S12_TDS({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (data.hasTDS === null) {
      e.hasTDS = 'Please answer this question.'
    }
    if (data.hasTDS === true && (!data.tdsDeducted || Number(data.tdsDeducted) <= 0)) {
      e.tdsDeducted = 'Please enter the TDS amount, or select No if no TDS was deducted.'
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    if (!data.hasTDS) update({ tdsDeducted: '' })
    goNext()
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="TDS Deducted">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">🧾</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Almost done</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Does your employer deduct income tax from your salary every month?
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
            Most salaried employees have tax deducted automatically before the salary is credited.
            This is called TDS — Tax Deducted at Source.
          </p>

          {/* Plain English explainer box */}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-blue-800">How to check in 10 seconds:</p>
            <ul className="space-y-1.5">
              {[
                'Open your last salary slip',
                "Look for a line called 'TDS', 'Income Tax' or 'IT Deduction'",
                'If you see a number greater than ₹0 — select Yes below',
                "If the field is missing or shows ₹0 — select No",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                  <span className="font-bold flex-shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Yes / No */}
        <div className="space-y-3">
          <div className="flex gap-3">
            {[
              { val: true,  label: 'Yes — tax is deducted from my salary' },
              { val: false, label: 'No — nothing is deducted' },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => { update({ hasTDS: val }); setErrors({}) }}
                className={`flex-1 py-2 px-2 rounded-xl border-2 text-sm font-semibold transition-all text-center leading-tight
                  ${data.hasTDS === val
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.hasTDS && <p role="alert" className="text-xs text-red-600">{errors.hasTDS}</p>}
        </div>

        {/* Amount input */}
        {data.hasTDS === true && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <NumberInput
              id="tds"
              label="Total tax deducted from your salary this financial year (April 2025 – March 2026)"
              value={data.tdsDeducted}
              onChange={v => { update({ tdsDeducted: v }); setErrors(p => ({ ...p, tdsDeducted: undefined })) }}
              placeholder="e.g. 85,000"
              hint="Add up all 12 months. Check your Form 16 or salary slips."
              required
            />
            {errors.tdsDeducted && <p role="alert" className="mt-1 text-xs text-red-600">{errors.tdsDeducted}</p>}
            <p className="text-xs text-blue-700">
              Not sure of the exact amount? Enter your best estimate. You can verify from Form 16 later.
            </p>
          </div>
        )}

        {data.hasTDS === false && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              No tax has been pre-paid on your behalf. The result screen will show your full tax liability,
              which you'll need to pay directly to the government before filing your return.
            </p>
          </div>
        )}

        {/* Bank TDS on FD interest — only shown if user has FD income */}
        {data.hasOtherIncome && Number(data.fdInterest) > 0 && (
          <div className="space-y-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-gray-800">
              Did your bank deduct tax (TDS) on your FD interest?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Banks deduct 10% TDS on FD interest above ₹40,000 per year (₹50,000 for senior citizens). Check your bank statement or Form 26AS for the exact amount.
            </p>
            <NumberInput
              id="bankTDS"
              label="TDS deducted by bank on FD interest"
              value={data.bankTDS}
              onChange={v => update({ bankTDS: v })}
              placeholder="e.g. 5,000"
              hint="Leave blank or enter 0 if your bank didn't deduct any TDS."
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Calculate My Tax →
        </button>

        <CommonQuestions questions={QUESTIONS} />
      </div>
    </StepWrapper>
  )
}
