import { useState, useRef } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'
import ConfusedLink from '../ConfusedLink'
import { CAP_80C } from '../../constants'

// Items that offer a monthly input option, with their default frequency
const FREQ_DEFAULTS = {
  epf: 'monthly',
  elss: 'monthly',
  homeLoanPrincipal: 'monthly',
  ppf: 'annual',
  lic: 'annual',
}

const INVESTMENT_ITEMS = [
  {
    key: 'epf',
    label: 'EPF — money deducted from my salary every month',
    emoji: '💼',
    description: "Employee Provident Fund. Your employer deducts ~12% of your basic pay every month. This is your share only — not the employer's. Check your salary slip for 'EPF Deduction' or 'PF Employee'.",
    tag: '80C',
  },
  {
    key: 'lic',
    label: 'LIC or other life insurance premiums',
    emoji: '🛡️',
    description: "Premiums you personally pay for a term plan, endowment plan, or any life insurance policy. Includes policies for your spouse and children. Does not include health insurance.",
    tag: '80C',
  },
  {
    key: 'ppf',
    label: 'PPF — Public Provident Fund',
    emoji: '📮',
    description: "A government savings scheme with a 15-year lock-in. You voluntarily deposit money into a PPF account (usually at SBI or post office) and earn ~7–8% tax-free interest.",
    tag: '80C',
  },
  {
    key: 'elss',
    label: 'ELSS — Tax saving mutual funds (SIP)',
    emoji: '📈',
    description: "Equity Linked Savings Scheme. A type of mutual fund with a 3-year lock-in. If you invest via monthly SIP, enter your SIP amount and select 'Per month'.",
    tag: '80C',
  },
  {
    key: 'tuition',
    label: "Children's school or college tuition fees",
    emoji: '🎓',
    description: "Tuition fees you paid for up to 2 children in any school, college, or university in India. Only the tuition portion counts — not hostel, bus, or other charges.",
    tag: '80C',
  },
  {
    key: 'homeLoanPrincipal',
    label: 'Home loan — principal repayment',
    emoji: '🏡',
    description: "The principal portion of your home loan EMI — the part that reduces your loan balance. The interest portion is a separate deduction asked on the next screen.",
    tag: '80C',
  },
  {
    key: 'nsc',
    label: 'NSC or Post Office time deposit',
    emoji: '📬',
    description: "National Savings Certificate (NSC) or Post Office Fixed Deposits (5-year). Government savings instruments available at the post office.",
    tag: '80C',
  },
]

const QUESTIONS = [
  {
    q: "What is the 80C limit?",
    a: "₹1,50,000 per year. All items in this section are grouped under Section 80C. No matter how much you invest across all these, the maximum tax benefit is on ₹1,50,000.",
  },
  {
    q: "EPF — my share or my employer's share?",
    a: "Only your share counts here. Your employer also contributes to EPF, but their contribution goes under a different section. On your salary slip, look for 'EPF Employee' or 'PF Deduction' — that's your share.",
  },
  {
    q: "I invest in NPS. Is that the same as EPF?",
    a: "No. NPS (National Pension System) is a separate scheme. We ask about it below in this same page. EPF is different — it's a mandatory deduction from your salary.",
  },
  {
    q: "Home loan principal here and interest later — are they different?",
    a: "Yes, completely different deductions. Principal repayment is under 80C (this section). The interest you pay on your home loan is under Section 24(b), which we'll ask about on the next screen.",
  },
  {
    q: "I invest more than ₹1.5 lakh. What happens to the extra?",
    a: "The tax benefit is capped at ₹1,50,000. Any amount above that gives no additional deduction under 80C. You can still invest more — it just won't reduce your tax further.",
  },
]

function fmtAnnual(n) {
  return Number(n).toLocaleString('en-IN')
}

function FreqToggle({ freq, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-indigo-200 overflow-hidden bg-indigo-50/50 p-0.5 gap-0.5">
      {[{ val: 'monthly', label: 'Per month' }, { val: 'annual', label: 'Per year' }].map(({ val, label }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all
            ${freq === val
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-indigo-400 hover:text-indigo-600'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function S09_TaxSavingInvestments({ data, update, goNext, goBack, skipTo, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  // Per-item frequency: 'monthly' | 'annual'. Keyed by investment key.
  const [frequencies, setFrequencies] = useState(() => {
    const init = {}
    INVESTMENT_ITEMS.forEach(({ key }) => {
      init[key] = FREQ_DEFAULTS[key] || 'annual'
    })
    return init
  })
  // Frequency for personal NPS
  const [npsFreq, setNpsFreq] = useState('annual')

  function handleBack() {
    if (!data.paysRent) {
      skipTo(7)
    } else {
      goBack()
    }
  }

  function toggleItem(key) {
    const current = data.has80CItems
    if (current.includes(key)) {
      update({
        has80CItems: current.filter(k => k !== key),
        investments80C: { ...data.investments80C, [key]: '' },
      })
    } else {
      update({ has80CItems: [...current, key] })
    }
    setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  function setFreq(key, freq) {
    // Convert stored annual value to the new display mode
    setFrequencies(prev => ({ ...prev, [key]: freq }))
  }

  // Returns the display value for the input (monthly or annual depending on freq)
  function displayVal(key) {
    const stored = Number(data.investments80C[key]) || 0
    if (stored === 0) return ''
    const freq = frequencies[key] || 'annual'
    return freq === 'monthly' ? String(Math.round(stored / 12)) : String(stored)
  }

  // Returns the display value for NPS input
  function npsDisplayVal() {
    const stored = Number(data.personalNPS) || 0
    if (stored === 0) return ''
    return npsFreq === 'monthly' ? String(Math.round(stored / 12)) : String(stored)
  }

  function handleItemChange(key, v) {
    const freq = frequencies[key] || 'annual'
    const num = Number(v) || 0
    const annual = freq === 'monthly' ? num * 12 : num
    update({ investments80C: { ...data.investments80C, [key]: annual > 0 ? String(annual) : '' } })
    setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  function handleNpsChange(v) {
    const num = Number(v) || 0
    const annual = npsFreq === 'monthly' ? num * 12 : num
    update({ personalNPS: annual > 0 ? String(annual) : '' })
    setErrors(p => ({ ...p, personalNPS: undefined }))
  }

  const total80C = data.has80CItems.reduce(
    (sum, key) => sum + (Number(data.investments80C[key]) || 0),
    0
  )
  const cappedTotal = Math.min(total80C, CAP_80C)
  const hitCap = total80C >= CAP_80C
  const pctUsed = Math.min(100, Math.round((total80C / CAP_80C) * 100))

  function validate() {
    const e = {}
    data.has80CItems.forEach(key => {
      if (!data.investments80C[key] || Number(data.investments80C[key]) <= 0) {
        e[key] = 'Enter amount.'
      }
    })
    if (data.hasPersonalNPS === null) {
      e.hasPersonalNPS = 'Please answer this question.'
    }
    if (data.hasPersonalNPS === true && (!data.personalNPS || Number(data.personalNPS) <= 0)) {
      e.personalNPS = 'Please enter your NPS investment amount.'
    }
    return e
  }

  function handleNext() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    goNext()
  }

  return (
    <StepWrapper goBack={handleBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Investments">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">📊</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Tax Saving Investments</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Do you make any of these investments?
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-sm text-gray-500">
              These reduce your tax under the old regime only. Tick all that apply.
            </p>
            <ConfusedLink faqRef={faqRef} label="What are these?" />
          </div>
        </div>

        {/* 80C Checklist */}
        <div className="space-y-3">
          {INVESTMENT_ITEMS.map(({ key, label, emoji, description, tag }) => {
            const checked = data.has80CItems.includes(key)
            const hasFreqOption = key in FREQ_DEFAULTS
            const freq = frequencies[key] || 'annual'
            const storedAnnual = Number(data.investments80C[key]) || 0
            return (
              <div key={key} className={`rounded-xl border-2 overflow-hidden transition-all ${checked ? 'border-indigo-600' : 'border-gray-200'}`}>
                <label className={`flex items-start gap-3 p-3 cursor-pointer ${checked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(key)}
                    className="sr-only"
                  />
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base" aria-hidden="true">{emoji}</span>
                      <span className={`text-sm font-semibold ${checked ? 'text-indigo-900' : 'text-gray-900'}`}>{label}</span>
                      <span className="text-xs text-gray-400">{tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
                  </div>
                </label>
                {checked && (
                  <div className="px-3 pb-3 bg-indigo-50 border-t border-indigo-100">
                    {/* Frequency toggle — only for items that support it */}
                    {hasFreqOption && (
                      <div className="flex items-center justify-between mt-2 mb-2">
                        <span className="text-xs text-indigo-600 font-medium">How are you entering this?</span>
                        <FreqToggle
                          freq={freq}
                          onChange={newFreq => setFreq(key, newFreq)}
                        />
                      </div>
                    )}
                    {!hasFreqOption && (
                      <p className="mt-2 mb-2 text-xs text-indigo-600 font-medium">Enter the annual total.</p>
                    )}
                    <NumberInput
                      id={key}
                      label={freq === 'monthly' ? 'Amount per month' : 'Amount per year'}
                      value={displayVal(key)}
                      onChange={v => handleItemChange(key, v)}
                      placeholder={freq === 'monthly' ? 'Monthly amount' : 'Annual amount'}
                      required
                    />
                    {/* Annual equivalent hint when in monthly mode */}
                    {hasFreqOption && freq === 'monthly' && storedAnnual > 0 && (
                      <p className="mt-1 text-xs text-indigo-600">
                        = ₹{fmtAnnual(storedAnnual)} per year (what we use for tax calculation)
                      </p>
                    )}
                    {errors[key] && <p role="alert" className="mt-1 text-xs text-red-600">{errors[key]}</p>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Running 80C total */}
        {data.has80CItems.length > 0 && (
          <div className="reveal p-4 bg-white border-2 border-gray-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Your 80C total</span>
              <span className={`text-sm font-bold ${hitCap ? 'text-green-600' : 'text-gray-900'}`}>
                ₹{cappedTotal.toLocaleString('en-IN')} / ₹1,50,000
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${hitCap ? 'bg-green-500' : 'bg-indigo-600'}`}
                style={{ width: `${pctUsed}%` }}
              />
            </div>
            {hitCap ? (
              <p className="text-xs text-green-700 font-medium">
                You've hit the ₹1,50,000 cap. Extra investments won't reduce tax further under 80C.
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                ₹{(CAP_80C - cappedTotal).toLocaleString('en-IN')} more can still earn a tax benefit.
              </p>
            )}
          </div>
        )}

        {/* Personal NPS */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Do you personally invest in NPS?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              NPS = National Pension System. A government retirement scheme where you voluntarily invest and get an extra ₹50,000 deduction — separate from and in addition to your 80C limit. Section 80CCD(1B). Old regime only.
            </p>
          </div>
          <div className="flex gap-3">
            {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(({ val, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => { update({ hasPersonalNPS: val }); setErrors(p => ({ ...p, hasPersonalNPS: undefined })) }}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                  ${data.hasPersonalNPS === val
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.hasPersonalNPS && <p role="alert" className="text-xs text-red-600">{errors.hasPersonalNPS}</p>}

          {data.hasPersonalNPS === true && (
            <div className="reveal space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">How are you entering this?</span>
                <FreqToggle freq={npsFreq} onChange={setNpsFreq} />
              </div>
              <NumberInput
                id="personalNPS"
                label={npsFreq === 'monthly' ? 'Amount per month' : 'Amount per year'}
                value={npsDisplayVal()}
                onChange={handleNpsChange}
                placeholder={npsFreq === 'monthly' ? 'Monthly amount' : 'e.g. 50,000'}
                note="Capped at ₹50,000 for deduction. Any extra doesn't reduce tax further."
                required
              />
              {npsFreq === 'monthly' && Number(data.personalNPS) > 0 && (
                <p className="text-xs text-indigo-600">
                  = ₹{Number(data.personalNPS).toLocaleString('en-IN')} per year
                </p>
              )}
              {errors.personalNPS && <p role="alert" className="mt-1 text-xs text-red-600">{errors.personalNPS}</p>}
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
