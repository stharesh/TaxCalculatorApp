import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

const QUESTIONS = [
  {
    q: "My company provides group health insurance. Can I claim that?",
    a: "No. Group insurance is paid by your company, not you. Only premiums that come out of your own pocket count.",
  },
  {
    q: "My father pays the premium for our family policy. Can I still claim it?",
    a: "No. Only premiums you personally pay count under Section 80D.",
  },
  {
    q: "I pay insurance for my in-laws. Does that count as parents?",
    a: "No. Section 80D only covers your own mother and father, not your spouse's parents.",
  },
  {
    q: "My parents are above 60 and uninsured. I spend on their medical bills. Can I claim anything?",
    a: "Yes. If your parents are above 60 and not insured, you can claim actual medical expenses up to ₹50,000 under Section 80D. Select Yes for parents and enter the amount you spent.",
  },
  {
    q: "I have no health insurance at all. Is there anything to claim?",
    a: "No deduction is available if you have no insurance and your parents are below 60. But seriously — get health insurance. A single hospitalisation can cost more than a year's premium.",
  },
]

function InsuranceCard({ title, subtitle, cap, checked, onToggle, amount, onAmountChange, amountError, children }) {
  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all ${checked ? 'border-indigo-500' : 'border-gray-200'}`}>
      {/* Card header */}
      <div className={`px-4 py-3 ${checked ? 'bg-indigo-50' : 'bg-gray-50'}`}>
        <p className={`text-sm font-semibold ${checked ? 'text-indigo-900' : 'text-gray-800'}`}>{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Yes / No toggle */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Do you personally pay a premium for this group?</p>
        <div className="flex gap-2">
          {[{ val: true, label: 'Yes, I pay' }, { val: false, label: 'No' }].map(({ val, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => onToggle(val)}
              className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all
                ${checked === val
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount — only shown when Yes */}
      {checked === true && (
        <div className="px-4 pb-4 bg-indigo-50 border-t border-indigo-100 space-y-2">
          <div className="pt-3">
            <NumberInput
              id={`premium-${title}`}
              label="How much do you pay per year?"
              value={amount}
              onChange={onAmountChange}
              placeholder="e.g. 20,000"
              note={`Tax benefit capped at ₹${cap.toLocaleString('en-IN')} per year`}
              required
            />
            {amountError && <p role="alert" className="mt-1 text-xs text-red-600">{amountError}</p>}
          </div>
          {children}
        </div>
      )}
    </div>
  )
}

export default function S10_HealthInsurance({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})
  const isUserAbove60 = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  const selfCap   = isUserAbove60 ? 50_000 : 25_000
  const parentCap = data.parentsAbove60 ? 50_000 : 25_000

  function validate() {
    const e = {}
    if (data.hasSelfInsurance === null) e.hasSelfInsurance = 'Please answer both sections above.'
    if (data.hasParentInsurance === null) e.hasParentInsurance = 'Please answer both sections above.'
    if (data.hasSelfInsurance && (!data.selfInsurancePremium || Number(data.selfInsurancePremium) <= 0)) {
      e.selfInsurancePremium = 'Please enter the premium amount.'
    }
    if (data.hasParentInsurance && (!data.parentInsurancePremium || Number(data.parentInsurancePremium) <= 0)) {
      e.parentInsurancePremium = 'Please enter the premium amount.'
    }
    if (data.hasParentInsurance && data.parentsAbove60 === null) {
      e.parentsAbove60 = 'Please select your parents\' age group.'
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    goNext()
  }

  const bothAnswered = data.hasSelfInsurance !== null && data.hasParentInsurance !== null
  const neitherPays  = data.hasSelfInsurance === false && data.hasParentInsurance === false

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Health Insurance">
      <div className="space-y-4">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">🏥</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Health Insurance</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Do you pay for health insurance?
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            There are <span className="font-medium text-gray-700">two separate tax benefits</span> here —
            one for insuring yourself and one for insuring your parents.
            Answer both cards below.
          </p>
          <p className="mt-1 text-xs text-gray-400">Section 80D — old regime only</p>
        </div>

        {/* Card 1 — Self */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">1</span>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your policy</p>
          </div>
          <InsuranceCard
            title="For you, your spouse or children"
            subtitle="Any health insurance policy that covers you or your immediate family"
            cap={selfCap}
            checked={data.hasSelfInsurance}
            onToggle={val => { update({ hasSelfInsurance: val, selfInsurancePremium: val ? data.selfInsurancePremium : '' }); setErrors(p => ({ ...p, hasSelfInsurance: undefined, selfInsurancePremium: undefined })) }}
            amount={data.selfInsurancePremium}
            onAmountChange={v => { update({ selfInsurancePremium: v }); setErrors(p => ({ ...p, selfInsurancePremium: undefined })) }}
            amountError={errors.selfInsurancePremium}
          />
        </div>

        {/* Card 2 — Parents */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">2</span>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your parents' policy</p>
          </div>
          <InsuranceCard
            title="For your mother or father"
            subtitle="A separate policy covering your own parents (not in-laws)"
            cap={parentCap}
            checked={data.hasParentInsurance}
            onToggle={val => { update({ hasParentInsurance: val, parentInsurancePremium: val ? data.parentInsurancePremium : '', parentsAbove60: val ? data.parentsAbove60 : null }); setErrors(p => ({ ...p, hasParentInsurance: undefined, parentInsurancePremium: undefined, parentsAbove60: undefined })) }}
            amount={data.parentInsurancePremium}
            onAmountChange={v => { update({ parentInsurancePremium: v }); setErrors(p => ({ ...p, parentInsurancePremium: undefined })) }}
            amountError={errors.parentInsurancePremium}
          >
            {/* Parents age — only shown inside card 2 when Yes */}
            <div className="space-y-2 pt-1">
              <p className="text-sm font-medium text-gray-800">How old are your parents?</p>
              <p className="text-xs text-gray-500">This changes the cap — ₹50,000 if above 60, ₹25,000 if below 60.</p>
              <div className="flex gap-2">
                {[{ val: true, label: 'Above 60' }, { val: false, label: 'Below 60' }].map(({ val, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { update({ parentsAbove60: val }); setErrors(p => ({ ...p, parentsAbove60: undefined })) }}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all
                      ${data.parentsAbove60 === val
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.parentsAbove60 && <p role="alert" className="text-xs text-red-600">{errors.parentsAbove60}</p>}
            </div>
          </InsuranceCard>
        </div>

        {/* Prompt if neither section answered yet */}
        {(errors.hasSelfInsurance || errors.hasParentInsurance) && (
          <p role="alert" className="text-sm text-red-600 font-medium">
            Please answer both sections — even if the answer is No.
          </p>
        )}

        {/* Feedback when both are No */}
        {neitherPays && bothAnswered && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              No 80D deduction will be applied. If you don't have health insurance, consider getting one —
              a single hospitalisation can easily cost ₹3–5 lakh.
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
