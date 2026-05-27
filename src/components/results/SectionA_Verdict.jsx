import { fmt } from '../../utils'

function getVerdictSentence(results, data) {
  const { newRegime, oldRegime, recommended, savings } = results

  // Zero tax under new regime
  if (recommended === 'new' && newRegime.totalTax === 0) {
    return "Your income falls under ₹12.75 lakh. Under the new regime you pay zero tax this year. No investments needed, no paperwork required."
  }

  // Very close — savings under ₹5,000
  if (savings < 5000) {
    const winner = recommended === 'new' ? 'New regime' : 'Old regime'
    return `It's close — just ${fmt(savings)} difference. ${winner} edges out. But if your deductions change next year, revisit this calculation.`
  }

  // New regime wins — deductions didn't overcome lower slabs
  if (recommended === 'new') {
    const totalOldDeductions = newRegime.grossIncome - oldRegime.taxableIncome
    return `Even with ${fmt(totalOldDeductions)} in deductions under the old regime, the new regime's lower slab rates still save you more. The new regime gives you a flat ₹75,000 standard deduction and taxes your income at lower rates — that's enough to beat the old regime here.`
  }

  // Old regime wins — deductions made the difference
  const reasons = []
  if (data.paysRent && data.hasHRA && data.hasHRAInSalary) reasons.push('HRA exemption')
  if (data.has80CItems.length > 0) reasons.push('80C investments')
  if (data.hasSelfInsurance) reasons.push('health insurance premium')
  if (data.hasHomeLoan && data.loanOwnership !== 'other') reasons.push('home loan interest')
  if (data.hasPersonalNPS) reasons.push('NPS contribution')

  const reasonText = reasons.length > 0
    ? `Your ${reasons.join(', ')} bring`
    : 'Your deductions bring'

  return `${reasonText} your taxable income down significantly. The deductions outweigh the new regime's lower rates in your case.`
}

export default function SectionA_Verdict({ results, data }) {
  const { recommended, savings, newRegime } = results
  const isNew = recommended === 'new'
  const isZeroTax = isNew && newRegime.totalTax === 0
  const sentence = getVerdictSentence(results, data)

  return (
    <div className={`rounded-2xl p-4 ${isNew ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
      {/* Badge */}
      <div className="mb-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1
          ${isNew ? 'bg-indigo-500 text-indigo-100' : 'bg-emerald-500 text-emerald-100'}`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Recommended for you
        </span>
      </div>

      {/* Regime name */}
      <h2 className="text-xl font-bold text-white mb-1">
        {isNew ? 'New Tax Regime' : 'Old Tax Regime'}
      </h2>

      {/* Savings or zero tax */}
      {isZeroTax ? (
        <div className="mb-3">
          <p className="text-3xl font-black text-white">₹0 tax</p>
          <p className="text-indigo-200 text-sm mt-0.5">You pay zero tax this year</p>
        </div>
      ) : (
        <div className="mb-3">
          <p className={`text-sm font-medium mb-0.5 ${isNew ? 'text-indigo-200' : 'text-emerald-200'}`}>
            You save
          </p>
          <p className="text-3xl font-black text-white">{fmt(savings)}</p>
          <p className={`text-sm mt-0.5 ${isNew ? 'text-indigo-200' : 'text-emerald-200'}`}>
            compared to the {isNew ? 'old' : 'new'} regime
          </p>
        </div>
      )}

      {/* Personalised explanation */}
      <div className={`rounded-xl p-3 ${isNew ? 'bg-indigo-700/60' : 'bg-emerald-700/60'}`}>
        <p className="text-sm text-white leading-relaxed">{sentence}</p>
      </div>
    </div>
  )
}
