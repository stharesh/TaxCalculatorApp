import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

const QUESTIONS = [
  {
    q: "I live in Bangalore, Hyderabad, Pune or Ahmedabad. Which do I pick?",
    a: "Pick 'All other cities' for FY 2025-26. These cities only become metro from FY 2026-27 onwards.",
  },
  {
    q: "I pay rent in cash. Does it count?",
    a: "Technically yes, but cash above ₹1 lakh per year is risky. Keep all rent receipts as proof.",
  },
  {
    q: "My company pays rent directly to my landlord.",
    a: "Enter that rent amount. It should also show as HRA received on your salary slip.",
  },
  {
    q: "My name is not on the rent agreement.",
    a: "The rent agreement should ideally be in your name. If it isn't, consult a CA before claiming.",
  },
]

const CITY_OPTIONS = [
  {
    value: 'metro',
    label: 'Metro city',
    description: 'Delhi, Mumbai, Kolkata or Chennai only',
    tag: '50% of basic salary used for HRA',
  },
  {
    value: 'nonMetro',
    label: 'All other cities',
    description: 'Bangalore, Hyderabad, Pune, Ahmedabad, and everywhere else',
    tag: '40% of basic salary used for HRA',
  },
]

export default function S08_RentDetails({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!data.monthlyRent || Number(data.monthlyRent) <= 0) {
      e.monthlyRent = 'Please enter your monthly rent.'
    }
    if (!data.cityType) {
      e.cityType = 'Please select your city type.'
    }
    if (data.hasHRAInSalary === null) {
      e.hasHRAInSalary = 'Please answer this question.'
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    goNext()
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Rent Details">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">🏠</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Rent Details</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Tell us about your rent</h2>
          <p className="mt-2 text-sm text-gray-500">
            HRA exemption uses three conditions. The lowest of the three is your tax benefit.
            <span className="block mt-1 text-xs text-gray-400">Section 10(13A) — old regime only</span>
          </p>
        </div>

        <div className="space-y-3">
          {/* Monthly Rent */}
          <div>
            <NumberInput
              id="monthlyRent"
              label="How much rent do you pay per month?"
              value={data.monthlyRent}
              onChange={v => { update({ monthlyRent: v }); setErrors(p => ({ ...p, monthlyRent: undefined })) }}
              placeholder="e.g. 18,000"
              required
            />
            {errors.monthlyRent && <p role="alert" className="mt-1 text-xs text-red-600">{errors.monthlyRent}</p>}
          </div>

          {/* City Type */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Which city do you currently live in?
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </legend>
            <div className="space-y-3">
              {CITY_OPTIONS.map(opt => {
                const selected = data.cityType === opt.value
                return (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="cityType"
                      value={opt.value}
                      checked={selected}
                      onChange={() => { update({ cityType: opt.value }); setErrors(p => ({ ...p, cityType: undefined })) }}
                      className="sr-only"
                    />
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${selected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}
                      aria-hidden="true"
                    >
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className={`text-sm font-semibold ${selected ? 'text-indigo-900' : 'text-gray-900'}`}>{opt.label}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                      <span className="text-xs text-indigo-600 font-medium">{opt.tag}</span>
                    </div>
                  </label>
                )
              })}
            </div>
            {errors.cityType && <p role="alert" className="mt-1 text-xs text-red-600">{errors.cityType}</p>}
          </fieldset>

          {/* Has HRA in salary */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Does your company give you HRA — did you enter it on the previous screen?
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </p>
            <div className="flex gap-3">
              {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(({ val, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { update({ hasHRAInSalary: val }); setErrors(p => ({ ...p, hasHRAInSalary: undefined })) }}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                    ${data.hasHRAInSalary === val
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.hasHRAInSalary && <p role="alert" className="text-xs text-red-600">{errors.hasHRAInSalary}</p>}

            {data.hasHRAInSalary === false && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  Without HRA in your salary, the standard HRA exemption won't apply even if you pay rent.
                </p>
              </div>
            )}
          </div>
        </div>

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
