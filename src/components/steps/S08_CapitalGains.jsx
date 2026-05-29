import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import ConfusedLink from '../ConfusedLink'
import CommonQuestions from '../CommonQuestions'
import { useRef } from 'react'

export default function S08_CapitalGains({ data, update, goNext, goBack, reset, step, progressStep, TOTAL_PROGRESS }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  function handleNext() {
    if (data.hasCapitalGains === null) {
      setErrors({ toggle: true })
      return
    }

    if (data.hasCapitalGains) {
      if (!data.stcgEquity && !data.ltcgEquity && !data.stcgProperty && !data.ltcgProperty) {
        setErrors({ amount: 'Please enter at least one amount, or select No.' })
        return
      }
    } else {
      update({ stcgEquity: '', ltcgEquity: '', stcgProperty: '', ltcgProperty: '' })
    }

    setErrors({})
    goNext()
  }

  const QUESTIONS = [
    { q: "What is STCG on Equity?", a: "Short-Term Capital Gains. Profit from selling shares or equity mutual funds held for less than 1 year (or 2 years for unlisted). Taxed at a flat 20%." },
    { q: "What is LTCG on Equity?", a: "Long-Term Capital Gains. Profit from selling shares or equity mutual funds held for more than 1 year. The first ₹1.25 lakh is tax-free. The rest is taxed at 12.5%." },
    { q: "How is Property STCG taxed?", a: "If you sell a property within 2 years, it's short-term. The profit is added to your regular income and taxed at slab rates." },
    { q: "How is Property LTCG taxed?", a: "If you sell a property after 2 years, it's long-term. Under new rules for FY 25-26, it's taxed at 12.5% without indexation benefits." }
  ]

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Capital Gains">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📈</div>
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Capital Gains</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Did you sell any shares, mutual funds, or property?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Capital gains have special tax rates that differ from your salary. <ConfusedLink faqRef={faqRef} label="How are these taxed?" />
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { update({ hasCapitalGains: true }); setErrors({}) }}
              className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${data.hasCapitalGains === true ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.hasCapitalGains === true ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                  {data.hasCapitalGains === true && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-semibold ${data.hasCapitalGains === true ? 'text-indigo-700' : 'text-gray-700'}`}>Yes, I had gains</span>
              </div>
            </button>
            <button
              onClick={() => { update({ hasCapitalGains: false }); setErrors({}) }}
              className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${data.hasCapitalGains === false ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.hasCapitalGains === false ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                  {data.hasCapitalGains === false && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-semibold ${data.hasCapitalGains === false ? 'text-indigo-700' : 'text-gray-700'}`}>No, I didn't</span>
              </div>
            </button>
          </div>
          {errors.toggle && <p className="text-red-600 text-xs font-medium reveal">Please select Yes or No.</p>}

          {data.hasCapitalGains && (
            <div className="reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <NumberInput
                id="stcgEquity"
                label="STCG on Equity / Mutual Funds"
                hint="Held < 1 year. Taxed at 20%."
                value={data.stcgEquity}
                onChange={val => { update({ stcgEquity: val }); setErrors({}) }}
                placeholder="0"
              />
              <NumberInput
                id="ltcgEquity"
                label="LTCG on Equity / Mutual Funds"
                hint="Held > 1 year. Taxed at 12.5%. (We will automatically exempt the first ₹1.25L)"
                value={data.ltcgEquity}
                onChange={val => { update({ ltcgEquity: val }); setErrors({}) }}
                placeholder="0"
              />
              <NumberInput
                id="stcgProperty"
                label="STCG on Property / Other Assets"
                hint="Taxed at your normal slab rates."
                value={data.stcgProperty}
                onChange={val => { update({ stcgProperty: val }); setErrors({}) }}
                placeholder="0"
              />
              <NumberInput
                id="ltcgProperty"
                label="LTCG on Property / Other Assets"
                hint="Taxed at 12.5% (no indexation)."
                value={data.ltcgProperty}
                onChange={val => { update({ ltcgProperty: val }); setErrors({}) }}
                placeholder="0"
              />
              {errors.amount && <p className="text-red-600 text-xs font-medium">{errors.amount}</p>}
            </div>
          )}
        </div>

        <button onClick={handleNext} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200">
          Continue →
        </button>

        <CommonQuestions ref={faqRef} questions={QUESTIONS} />
      </div>
    </StepWrapper>
  )
}
