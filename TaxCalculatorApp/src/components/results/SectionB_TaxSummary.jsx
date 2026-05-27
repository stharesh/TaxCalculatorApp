import { fmt } from '../../utils'

function TDSMessage({ tds, tdsDeducted }) {
  if (!tdsDeducted) return null

  const { type, amount } = tds

  if (type === 'refund') {
    return (
      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">You're getting a refund of {fmt(amount)}</p>
          <p className="text-xs text-green-700 mt-0.5">
            You overpaid TDS. File your income tax return to claim this refund. Last date: 31st July 2026.
          </p>
        </div>
      </div>
    )
  }

  if (type === 'payable') {
    return (
      <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-red-800">You still owe {fmt(amount)} in tax</p>
          <p className="text-xs text-red-700 mt-0.5">
            Pay this as self-assessment tax before filing your return to avoid interest and penalties.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">You are exactly settled</p>
        <p className="text-xs text-gray-600 mt-0.5">Your TDS matches your tax liability. Nothing more to pay.</p>
      </div>
    </div>
  )
}

export default function SectionB_TaxSummary({ results, data }) {
  const { newRegime, oldRegime, recommended, tds, tdsDeducted, employerTDS, bankTDS } = results
  const isNewWinner = recommended === 'new'

  const regimes = [
    {
      label: 'New Regime',
      taxableIncome: newRegime.taxableIncome,
      totalTax: newRegime.totalTax,
      isWinner: isNewWinner,
    },
    {
      label: 'Old Regime',
      taxableIncome: oldRegime.taxableIncome,
      totalTax: oldRegime.totalTax,
      isWinner: !isNewWinner,
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Tax Summary</h3>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-2 gap-3">
        {regimes.map(r => (
          <div
            key={r.label}
            className={`relative rounded-xl p-3 border-2 transition-all
              ${r.isWinner
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'}`}
          >
            {r.isWinner && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 whitespace-nowrap">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Best for you
                </span>
              </div>
            )}

            <p className={`text-xs font-semibold mb-3 ${r.isWinner ? 'text-green-700' : 'text-gray-500'}`}>
              {r.label}
            </p>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Taxable income</p>
                <p className={`text-sm font-semibold ${r.isWinner ? 'text-green-800' : 'text-gray-800'}`}>
                  {fmt(r.taxableIncome)}
                </p>
              </div>
              <div className={`pt-2 border-t ${r.isWinner ? 'border-green-200' : 'border-gray-100'}`}>
                <p className="text-xs text-gray-500">Total tax</p>
                <p className={`text-lg font-bold ${r.isWinner ? 'text-green-700' : 'text-gray-700'}`}>
                  {fmt(r.totalTax)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TDS line */}
      {tdsDeducted > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
          <p className="text-xs text-gray-600">
            Total TDS already paid:{' '}
            <span className="font-semibold text-gray-800">{fmt(tdsDeducted)}</span>
            {employerTDS > 0 && bankTDS > 0 && (
              <span className="text-gray-400"> ({fmt(employerTDS)} employer + {fmt(bankTDS)} bank)</span>
            )}
          </p>
          <p className="text-[11px] text-gray-400">
            Refund or balance due is calculated against the {recommended === 'new' ? 'New' : 'Old'} Regime (the one we recommend for you).
          </p>
        </div>
      )}

      {/* Refund / Payable / Settled */}
      <TDSMessage tds={tds} tdsDeducted={tdsDeducted} />

      {/* Advance tax warning for FD income without employer coverage */}
      {data && data.hasOtherIncome && Number(data.fdInterest) > 0 && tds.type === 'payable' && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>About your FD interest:</strong> Your employer's TDS may not cover the tax on your FD income.
            If the balance due is more than ₹10,000, you may need to pay advance tax in quarterly instalments
            to avoid interest charges under Section 234B/234C. Check with a CA or the income tax portal.
          </p>
        </div>
      )}
    </div>
  )
}
