import { useState } from 'react'

/**
 * A number input with Monthly / Per year toggle.
 * Always calls onChange(annualValue).
 * Displays equivalent value when monthly is selected.
 */
export default function FrequencyInput({
  id,
  label,
  value,          // always the annual figure stored in state
  onChange,       // always called with annual figure
  placeholder = '0',
  required,
  hint,
  note,
  prefix = '₹',
}) {
  const [freq, setFreq] = useState('annual')

  // Display value depends on frequency
  const displayValue = (() => {
    if (value === '' || value === null || value === undefined) return ''
    const n = Number(value)
    if (isNaN(n) || n === 0) return ''
    return freq === 'monthly' ? Math.round(n / 12) : n
  })()

  function formatINR(val) {
    if (val === '' || val === 0) return ''
    const n = Number(val)
    if (isNaN(n)) return ''
    return n.toLocaleString('en-IN')
  }

  function handleInput(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    const num = raw === '' ? '' : Number(raw)
    const annual = raw === '' ? '' : (freq === 'monthly' ? num * 12 : num)
    onChange(annual)
  }

  const annualEquivalent = (() => {
    if (freq !== 'monthly') return null
    const n = Number(value)
    if (!n) return null
    return n.toLocaleString('en-IN')
  })()

  const isValid = value !== '' && value !== null && value !== undefined && Number(value) > 0

  return (
    <div className="space-y-1.5">
      {/* Label row with freq toggle */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 leading-snug">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        {/* Frequency pill toggle */}
        <div className="flex rounded-full border border-gray-200 overflow-hidden bg-gray-50 p-0.5 gap-0.5 shrink-0">
          {['monthly', 'annual'].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFreq(f)}
              className={`px-3 py-1 text-xs font-semibold transition-all rounded-full
                ${freq === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f === 'monthly' ? 'Monthly' : 'Per year'}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative rounded-xl">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400 text-sm font-medium">{prefix}</span>
          </div>
        )}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={formatINR(displayValue)}
          onChange={handleInput}
          placeholder={freq === 'monthly' ? 'Monthly amount' : placeholder}
          required={required}
          className={`block w-full rounded-xl border py-2.5 text-sm text-gray-900
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
            placeholder:text-gray-400
            ${isValid ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}
            pl-8 pr-9`}
        />
        {isValid && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Auto-calculated annual equivalent */}
      {annualEquivalent && (
        <p className="text-xs text-indigo-600 font-medium reveal">
          = ₹{annualEquivalent} per year (auto-calculated)
        </p>
      )}

      {note && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
          {note}
        </p>
      )}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
