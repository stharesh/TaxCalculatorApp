export default function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder = '0',
  hint,
  note,
  required = false,
  max,
  prefix = '₹',
}) {
  function handleChange(e) {
    // Allow only digits
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange(raw === '' ? '' : Number(raw))
  }

  // Format with Indian number system commas
  function formatINR(val) {
    if (val === '' || val === 0 || val === '0') return ''
    const num = Number(val)
    if (isNaN(num)) return ''
    return num.toLocaleString('en-IN')
  }

  const isValid = value !== '' && value !== null && value !== undefined && Number(value) > 0

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
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
          pattern="[0-9]*"
          value={formatINR(value)}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`block w-full rounded-xl border py-2.5 text-sm text-gray-900
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
            placeholder:text-gray-400
            ${isValid ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}
            ${prefix ? 'pl-8 pr-9' : 'px-3'}`}
        />
        {isValid && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {note && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
          {note}
        </p>
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  )
}
