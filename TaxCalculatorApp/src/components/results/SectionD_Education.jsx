import { useState } from 'react'
import { fmt, toNum } from '../../utils'

export default function SectionD_Education({ results, data }) {
  const [open, setOpen] = useState(false)
  const { oldRegime } = results

  // Build rows only for items the user actually has
  const rows = []

  // Salary income — always present
  rows.push({
    what: 'Salary income',
    taxName: 'Income from Salary',
    treatment: 'Taxable in both regimes.',
  })

  // HRA from company
  if (data.hasHRA && toNum(data.hraMonthly) > 0) {
    rows.push({
      what: 'HRA from your company',
      taxName: 'Part of Salary / Section 10(13A)',
      treatment: data.paysRent && data.hasHRAInSalary
        ? `Partially exempt under old regime. Your exemption: ${fmt(oldRegime.hraExemption)}. Fully taxable under new regime.`
        : 'Fully taxable in both regimes since you don\'t pay rent.',
    })
  }

  // Bonus
  if (data.hasBonus && toNum(data.bonus) > 0) {
    rows.push({
      what: 'Bonus / incentive',
      taxName: 'Income from Salary',
      treatment: 'Fully taxable in both regimes.',
    })
  }

  // FD interest
  if (data.hasOtherIncome && toNum(data.fdInterest) > 0) {
    rows.push({
      what: 'FD interest',
      taxName: 'Income from Other Sources',
      treatment: data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
        ? `Taxable, but included in 80TTB deduction (savings + FD) up to ₹50,000 under old regime. Fully taxable under new regime.`
        : 'Fully taxable in both regimes. No deduction available for FD interest if you\'re below 60.',
    })
  }

  // Savings interest
  if (data.hasOtherIncome && toNum(data.savingsInterest) > 0) {
    const isAbove60 = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
    rows.push({
      what: 'Savings account interest',
      taxName: isAbove60 ? 'Income from Other Sources / Section 80TTB' : 'Income from Other Sources / Section 80TTA',
      treatment: isAbove60
        ? 'Taxable, but covered under 80TTB (savings + FD combined) up to ₹50,000 under old regime.'
        : 'Taxable, but deductible up to ₹10,000 under old regime (Section 80TTA). Fully taxable under new regime.',
    })
  }

  // Standard deduction — always
  rows.push({
    what: 'Standard deduction',
    taxName: 'Section 16(ia)',
    treatment: 'Auto-applied. ₹75,000 in new regime, ₹50,000 in old regime. No action needed from you.',
  })

  // Professional tax
  if (data.hasProfTax && toNum(data.professionalTax) > 0) {
    rows.push({
      what: 'Professional tax',
      taxName: 'Section 16(iii)',
      treatment: 'Old regime only. Deductible up to ₹2,500 per year under Section 16(iii). Not available in the new regime.',
    })
  }

  // 80C
  if (data.has80CItems.length > 0) {
    const total80C = data.has80CItems.reduce((s, k) => s + toNum(data.investments80C[k]), 0)
    rows.push({
      what: 'EPF, LIC, PPF, ELSS, and other 80C investments',
      taxName: 'Section 80C',
      treatment: `Old regime only. You entered ${fmt(total80C)}. After the ₹1,50,000 cap, ${fmt(oldRegime.deduction80C)} is deducted from your taxable income. Zero deduction under new regime.`,
    })
  }

  // Personal NPS
  if (data.hasPersonalNPS && toNum(data.personalNPS) > 0) {
    rows.push({
      what: 'Your personal NPS investment',
      taxName: 'Section 80CCD(1B)',
      treatment: `Old regime only. Additional deduction of ${fmt(oldRegime.deductionPersonalNPS)} over and above your 80C limit. Not available under new regime.`,
    })
  }

  // Employer NPS
  if (data.hasEmployerNPS && toNum(data.employerNPS) > 0) {
    rows.push({
      what: "Employer's NPS contribution",
      taxName: 'Section 80CCD(2)',
      treatment: `Available in both regimes. Capped at 14% of basic salary. Your deduction: ${fmt(oldRegime.employerNPSDeduction)}.`,
    })
  }

  // Health insurance
  if (data.hasSelfInsurance && toNum(data.selfInsurancePremium) > 0) {
    rows.push({
      what: 'Health insurance premium',
      taxName: 'Section 80D',
      treatment: `Old regime only. Self/family deduction: ${fmt(oldRegime.deduction80DSelf)}${oldRegime.deduction80DParents > 0 ? `, parents: ${fmt(oldRegime.deduction80DParents)}` : ''}. Total: ${fmt(oldRegime.deduction80D)}. Zero deduction under new regime.`,
    })
  }

  // Home loan interest
  if (data.hasHomeLoan && data.loanOwnership !== 'other' && toNum(data.homeLoanInterest) > 0) {
    rows.push({
      what: 'Home loan interest',
      taxName: 'Section 24(b)',
      treatment: `Old regime only. Capped at ₹2,00,000 for self-occupied property. Your deduction: ${fmt(oldRegime.deductionHomeLoanInterest)}. Not available under new regime.`,
    })
  }

  // 87A rebate
  rows.push({
    what: 'Government tax rebate',
    taxName: 'Section 87A',
    treatment: 'New regime: up to ₹60,000 if taxable income is ₹12,00,000 or below. Old regime: up to ₹12,500 if taxable income is ₹5,00,000 or below (not for super senior citizens).',
  })

  // Cess
  rows.push({
    what: '4% Health & Education Cess',
    taxName: 'Finance Act',
    treatment: 'Applied to tax after rebate in both regimes. This goes to government health and education funds.',
  })

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(x => !x)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-800">How did we calculate this?</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 mt-3 mb-4">
            Only items that apply to you are shown here.
          </p>
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-start gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{row.what}</p>
                    <p className="text-xs text-indigo-600 font-medium">{row.taxName}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed ml-3.5">{row.treatment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
