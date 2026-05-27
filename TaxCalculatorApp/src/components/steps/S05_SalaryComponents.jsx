import { useState, useRef } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import FrequencyInput from '../FrequencyInput'
import CommonQuestions from '../CommonQuestions'
import ConfusedLink from '../ConfusedLink'

const QUESTIONS = [
  {
    q: "What exactly is HRA and when does it save tax?",
    a: "HRA is House Rent Allowance — a portion of your salary specifically meant to cover rent. If you actually pay rent, part of this HRA becomes tax-free. If you don't pay rent, it becomes fully taxable.",
  },
  {
    q: "What is Professional Tax? Is it the same as income tax?",
    a: "No, they're different. Professional Tax is a small state-level tax (₹200/month max) that your employer deducts on behalf of your state government. It's completely separate from income tax. If you see ₹200 deducted from your salary every month, that's Professional Tax.",
  },
  {
    q: "What is Employer NPS? I invest in NPS myself too.",
    a: "Employer NPS is the amount your company puts into your NPS account as part of your CTC — you never see this money in your take-home. It's different from what you personally invest in NPS. We'll ask about your own NPS investment separately.",
  },
  {
    q: "I have HRA on my slip but I don't pay rent. Do I tick it?",
    a: "Yes, tick it and enter the amount. Without rent payments, the HRA will be fully taxable — but we still need to know about it.",
  },
  {
    q: "My company contributes to EPF, not NPS. Where does that go?",
    a: "Employer's EPF contribution is not entered here. Only Employer NPS (if your company specifically has an NPS scheme) goes in this section.",
  },
]

const COMPONENTS = [
  {
    key: 'hasHRA',
    label: 'HRA — House Rent Allowance',
    tag: 'Section 10(13A)',
    emoji: '🏠',
    description: 'A part of your salary meant for rent. Can be partially tax-free if you pay rent.',
  },
  {
    key: 'hasProfTax',
    label: 'Professional Tax',
    tag: 'Section 16(iii)',
    emoji: '🏛️',
    description: 'State govt tax deducted monthly from your salary. Usually ₹200/month (max ₹2,400/year).',
  },
  {
    key: 'hasEmployerNPS',
    label: 'Employer NPS contribution',
    tag: 'Section 80CCD(2)',
    emoji: '🏦',
    description: "Your company puts money into your NPS retirement account as part of your pay package.",
  },
]

export default function S05_SalaryComponents({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  function toggleComponent(key) {
    update({ [key]: !data[key] })
    setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  function validate() {
    const e = {}
    if (data.hasHRA && (!data.hraMonthly || Number(data.hraMonthly) <= 0)) {
      e.hraMonthly = 'Please enter your monthly HRA amount.'
    }
    if (data.hasProfTax && (!data.professionalTax || Number(data.professionalTax) <= 0)) {
      e.professionalTax = 'Please enter professional tax amount.'
    }
    if (data.hasEmployerNPS && (!data.employerNPS || Number(data.employerNPS) <= 0)) {
      e.employerNPS = 'Please enter employer NPS contribution.'
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    goNext()
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Salary Components">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">📋</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Salary Components</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Does your salary slip show any of these?
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-sm text-gray-500">Tick all that appear on your slip. Leave the rest blank.</p>
            <ConfusedLink faqRef={faqRef} label="What are these?" />
          </div>
        </div>

        <div className="space-y-3">
          {COMPONENTS.map(({ key, label, tag, emoji, description }) => {
            const checked = data[key]
            return (
              <div key={key} className={`rounded-xl border-2 overflow-hidden transition-all ${checked ? 'border-indigo-600' : 'border-gray-200'}`}>
                <label className={`flex items-start gap-3 p-3 cursor-pointer ${checked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleComponent(key)}
                    className="sr-only"
                  />
                  {/* Custom checkbox */}
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${checked ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}
                    aria-hidden="true"
                  >
                    {checked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base" aria-hidden="true">{emoji}</span>
                      <span className={`text-sm font-semibold ${checked ? 'text-indigo-900' : 'text-gray-900'}`}>{label}</span>
                      <span className="text-xs text-gray-400 font-normal">{tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                </label>

                {/* Sub-input */}
                {checked && (
                  <div className="px-4 pb-4 bg-indigo-50 border-t border-indigo-100">
                    {key === 'hasHRA' && (
                      <div className="mt-3">
                        <NumberInput
                          id="hra"
                          label="How much HRA do you receive per month?"
                          value={data.hraMonthly}
                          onChange={v => { update({ hraMonthly: v }); setErrors(p => ({ ...p, hraMonthly: undefined })) }}
                          placeholder="e.g. 15,000"
                          hint="Find it on your salary slip under Earnings."
                          required
                        />
                        {errors.hraMonthly && <p role="alert" className="mt-1 text-xs text-red-600">{errors.hraMonthly}</p>}
                      </div>
                    )}
                    {key === 'hasProfTax' && (
                      <div className="mt-3">
                        <FrequencyInput
                          id="profTax"
                          label="How much Professional Tax is deducted?"
                          value={data.professionalTax}
                          onChange={v => { update({ professionalTax: v }); setErrors(p => ({ ...p, professionalTax: undefined })) }}
                          placeholder="200"
                          note="Usually ₹200/month = ₹2,400/year. Maximum is ₹2,500 per year."
                          required
                        />
                        {errors.professionalTax && <p role="alert" className="mt-1 text-xs text-red-600">{errors.professionalTax}</p>}
                      </div>
                    )}
                    {key === 'hasEmployerNPS' && (
                      <div className="mt-3">
                        <FrequencyInput
                          id="employerNPS"
                          label="How much does your employer contribute to NPS?"
                          value={data.employerNPS}
                          onChange={v => { update({ employerNPS: v }); setErrors(p => ({ ...p, employerNPS: undefined })) }}
                          placeholder="0"
                          hint="Check your CTC breakdown or salary slip. This is your employer's contribution, not yours."
                          required
                        />
                        {errors.employerNPS && <p role="alert" className="mt-1 text-xs text-red-600">{errors.employerNPS}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center">If none of these appear on your slip, leave them all unticked and continue.</p>

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
