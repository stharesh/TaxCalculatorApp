import { fmt, calc80CTotal, toNum } from '../../utils'
import { CAP_80C } from '../../constants'

function Suggestion({ icon, text, highlight }) {
  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border
      ${highlight
        ? 'bg-indigo-50 border-indigo-200'
        : 'bg-white border-gray-200'}`}>
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <p className={`text-xs leading-relaxed ${highlight ? 'text-indigo-800' : 'text-gray-700'}`}>
        {text}
      </p>
    </div>
  )
}

export default function SectionE_NextSteps({ results, data }) {
  const { newRegime, oldRegime, recommended, savings, tds, tdsDeducted } = results

  const isOldRecommended = recommended === 'old'
  const isNewRecommended = recommended === 'new'
  const total80C = calc80CTotal(data)
  const remainingCap = CAP_80C - Math.min(total80C, CAP_80C)

  const suggestions = []

  // 1. Always shown — tell HR
  suggestions.push({
    icon: '📋',
    text: 'Tell your HR or payroll team which regime you want at the start of the financial year so they deduct the correct TDS monthly. This is important — the wrong regime means wrong deductions all year.',
    highlight: true,
  })

  // 2. Zero tax under new regime
  if (isNewRecommended && newRegime.totalTax === 0) {
    suggestions.push({
      icon: '🎉',
      text: 'Your income is under ₹12.75 lakh and your new regime tax is zero. You do not need to make any tax-saving investments this year unless you want to for your own financial goals.',
    })
  }

  // 3. Haven't maxed 80C and regimes are close
  if (total80C < CAP_80C && savings < 3000) {
    suggestions.push({
      icon: '💡',
      text: `You haven't maxed your 80C investments. You've used ${fmt(Math.min(total80C, CAP_80C))} out of ₹1,50,000. Investing ${fmt(remainingCap)} more in EPF, PPF, ELSS or LIC could make the old regime competitive for you.`,
    })
  }

  // 4. No personal NPS and old regime is recommended or regimes are close
  if (!data.hasPersonalNPS && (isOldRecommended || savings < 5000)) {
    suggestions.push({
      icon: '🏦',
      text: 'You are not claiming any NPS personal deduction. Investing up to ₹50,000 in NPS gives you an additional deduction over your 80C limit under the old regime (Section 80CCD(1B)). This is separate from and in addition to your 80C limit.',
    })
  }

  // 5. No parent insurance and old regime wins
  if (!data.hasParentInsurance && isOldRecommended) {
    suggestions.push({
      icon: '❤️',
      text: 'Consider health insurance for your parents. It adds ₹25,000 to ₹50,000 in deductions under the old regime (depending on their age) which could increase your savings further.',
    })
  }

  // 6. No self insurance at all
  if (!data.hasSelfInsurance) {
    suggestions.push({
      icon: '🏥',
      text: 'Consider getting your own health insurance if you don\'t have one. Beyond the tax benefit, a medical emergency without insurance can wipe out years of savings overnight.',
    })
  }

  // 7. TDS refund
  if (tdsDeducted > 0 && tds.type === 'refund') {
    suggestions.push({
      icon: '💰',
      text: `You have overpaid ${fmt(tds.amount)} in TDS this year. File your income tax return (ITR) to claim this refund. The last date for filing is 31st July 2026.`,
    })
  }

  // 8. Tax still payable
  if (tdsDeducted > 0 && tds.type === 'payable') {
    suggestions.push({
      icon: '⚠️',
      text: `You still owe ${fmt(tds.amount)} in tax. Pay this as self-assessment tax (through the income tax portal) before filing your return to avoid interest and penalties under Section 234.`,
    })
  }

  // Edge case: no TDS deducted at all but tax is due
  if (!tdsDeducted && (isNewRecommended ? newRegime.totalTax : oldRegime.totalTax) > 0) {
    const taxDue = isNewRecommended ? newRegime.totalTax : oldRegime.totalTax
    suggestions.push({
      icon: '⚠️',
      text: `No TDS was deducted. You owe ${fmt(taxDue)} in tax. Pay this as self-assessment tax before filing your return.`,
    })
  }

  if (suggestions.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">What to do next</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {suggestions.map((s, i) => (
          <Suggestion key={i} icon={s.icon} text={s.text} highlight={s.highlight} />
        ))}
      </div>
      <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
        These suggestions are general pointers based on your inputs — not personalised financial or tax advice.
        Every person's situation is different. Please consult a qualified Chartered Accountant or tax professional
        before making investment or filing decisions.
      </p>
    </div>
  )
}
