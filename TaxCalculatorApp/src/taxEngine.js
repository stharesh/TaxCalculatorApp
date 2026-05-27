/**
 * Tax Engine — FY 2025-26
 * All functions are pure (no side effects). Input: the global state object from App.jsx.
 */

import {
  STANDARD_DEDUCTION_NEW, STANDARD_DEDUCTION_OLD,
  PROF_TAX_CAP, EMPLOYER_NPS_PCT_OF_BASIC,
  CAP_80C, CAP_80CCD1B,
  CAP_80D_SELF_BELOW60, CAP_80D_SELF_ABOVE60,
  CAP_80D_PARENTS_BELOW60, CAP_80D_PARENTS_ABOVE60,
  CAP_24B, CAP_80TTA, CAP_80TTB,
  REBATE_87A_NEW_INCOME_LIMIT, REBATE_87A_NEW_MAX,
  MARGINAL_RELIEF_THRESHOLD,
  REBATE_87A_OLD_INCOME_LIMIT, REBATE_87A_OLD_MAX,
  CESS_RATE,
  HRA_METRO_PCT, HRA_NONMETRO_PCT,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS_BELOW60, OLD_REGIME_SLABS_SENIOR, OLD_REGIME_SLABS_SUPER_SENIOR,
} from './constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert empty string or undefined to 0 */
function n(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

/**
 * Apply progressive slab tax.
 * slabs: [{ upTo, rate }] ordered from lowest to highest.
 * Returns total tax (before rebate/cess).
 */
export function applySlabs(income, slabs) {
  if (income <= 0) return 0
  let tax = 0
  let prev = 0

  for (const { upTo, rate } of slabs) {
    if (upTo === null) {
      // Highest slab — tax the remainder
      tax += (income - prev) * rate
      break
    }
    if (income <= upTo) {
      tax += (income - prev) * rate
      break
    }
    tax += (upTo - prev) * rate
    prev = upTo
  }

  return Math.round(tax)
}

// ─── Step 1: Gross Total Income ───────────────────────────────────────────────

export function calculateGrossIncome(data) {
  const takeHome  = n(data.takeHomeSalaryMonthly) * 12
  const bonus     = n(data.bonus)
  const fdInterest = n(data.fdInterest)
  const savingsInterest = n(data.savingsInterest)
  return takeHome + bonus + fdInterest + savingsInterest
}

// ─── HRA Exemption ────────────────────────────────────────────────────────────

export function calculateHRAExemption(data) {
  // Only applicable if user pays rent AND has HRA in salary
  if (!data.paysRent || !data.hasHRA || n(data.hraMonthly) === 0) return 0

  const annualHRAReceived = n(data.hraMonthly) * 12
  const annualBasic       = n(data.basicSalaryMonthly) * 12
  const annualRentPaid    = n(data.monthlyRent) * 12
  const hraPct = data.cityType === 'metro' ? HRA_METRO_PCT : HRA_NONMETRO_PCT

  const condition1 = annualHRAReceived
  const condition2 = hraPct * annualBasic
  const condition3 = annualRentPaid - 0.10 * annualBasic

  // Exemption = min of all three; cannot be negative
  return Math.round(Math.max(0, Math.min(condition1, condition2, condition3)))
}

// ─── Step 2: New Regime ───────────────────────────────────────────────────────

export function calculateNewRegimeTax(data) {
  const grossIncome        = calculateGrossIncome(data)
  const annualBasic        = n(data.basicSalaryMonthly) * 12
  // Professional tax Section 16(iii) is NOT allowed in the new regime.
  // Only standard deduction Section 16(ia) and employer NPS 80CCD(2) apply.
  const employerNPS        = data.hasEmployerNPS
    ? Math.min(n(data.employerNPS), EMPLOYER_NPS_PCT_OF_BASIC * annualBasic)
    : 0

  const taxableIncome = Math.max(
    0,
    grossIncome - STANDARD_DEDUCTION_NEW - employerNPS
  )

  const slabTax = applySlabs(taxableIncome, NEW_REGIME_SLABS)

  // Section 87A rebate — new regime
  let rebate = 0
  if (taxableIncome <= REBATE_87A_NEW_INCOME_LIMIT) {
    rebate = Math.min(slabTax, REBATE_87A_NEW_MAX)
  }

  // Marginal relief: if taxable income just above 12L, tax cannot exceed income above 12L
  let marginalRelief = 0
  let taxAfterRebate = Math.max(0, slabTax - rebate)
  if (taxableIncome > MARGINAL_RELIEF_THRESHOLD && rebate === 0) {
    const excess = taxableIncome - MARGINAL_RELIEF_THRESHOLD
    if (taxAfterRebate > excess) {
      marginalRelief = taxAfterRebate - excess
      taxAfterRebate = excess
    }
  }

  const cess     = Math.round(taxAfterRebate * CESS_RATE)
  const totalTax = taxAfterRebate + cess

  return {
    grossIncome,
    taxableIncome,
    standardDeduction: STANDARD_DEDUCTION_NEW,
    professionalTaxDeduction: 0,   // not available in new regime
    employerNPSDeduction: employerNPS,
    slabTax,
    rebate,
    marginalRelief,
    cess,
    totalTax,
  }
}

// ─── Step 3: Old Regime ───────────────────────────────────────────────────────

export function calculateOldRegimeTax(data) {
  const grossIncome     = calculateGrossIncome(data)
  const annualBasic     = n(data.basicSalaryMonthly) * 12
  const isAbove60       = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  const isSuperSenior   = data.ageGroup === 'superSenior'

  // Deductions
  const professionalTax = Math.min(n(data.professionalTax), PROF_TAX_CAP)
  const hraExemption    = calculateHRAExemption(data)

  // 80C
  const total80C = data.has80CItems.reduce((sum, key) => sum + n(data.investments80C[key]), 0)
  const deduction80C = Math.min(total80C, CAP_80C)

  // 80D
  const selfCap   = isAbove60 ? CAP_80D_SELF_ABOVE60 : CAP_80D_SELF_BELOW60
  const deduction80DSelf = data.hasSelfInsurance
    ? Math.min(n(data.selfInsurancePremium), selfCap)
    : 0

  const parentCap = data.parentsAbove60 ? CAP_80D_PARENTS_ABOVE60 : CAP_80D_PARENTS_BELOW60
  const deduction80DParents = data.hasParentInsurance
    ? Math.min(n(data.parentInsurancePremium), parentCap)
    : 0

  const deduction80D = deduction80DSelf + deduction80DParents

  // Home Loan Interest — Section 24(b)
  const deductionHomeLoanInterest = (data.hasHomeLoan && data.loanOwnership !== 'other')
    ? Math.min(n(data.homeLoanInterest), CAP_24B)
    : 0

  // 80TTA / 80TTB
  let deduction80TTA_TTB = 0
  if (isAbove60) {
    // 80TTB: savings + FD interest combined, up to 50,000
    deduction80TTA_TTB = Math.min(n(data.savingsInterest) + n(data.fdInterest), CAP_80TTB)
  } else {
    // 80TTA: savings interest only, up to 10,000
    deduction80TTA_TTB = Math.min(n(data.savingsInterest), CAP_80TTA)
  }

  // Personal NPS 80CCD(1B)
  const deductionPersonalNPS = data.hasPersonalNPS
    ? Math.min(n(data.personalNPS), CAP_80CCD1B)
    : 0

  // Employer NPS 80CCD(2)
  const employerNPS = data.hasEmployerNPS
    ? Math.min(n(data.employerNPS), EMPLOYER_NPS_PCT_OF_BASIC * annualBasic)
    : 0

  const totalDeductions =
    STANDARD_DEDUCTION_OLD +
    professionalTax +
    hraExemption +
    deduction80C +
    deduction80D +
    deductionHomeLoanInterest +
    deduction80TTA_TTB +
    deductionPersonalNPS +
    employerNPS

  const taxableIncome = Math.max(0, grossIncome - totalDeductions)

  // Select slab table based on age
  let slabs
  if (isSuperSenior) slabs = OLD_REGIME_SLABS_SUPER_SENIOR
  else if (isAbove60) slabs = OLD_REGIME_SLABS_SENIOR
  else slabs = OLD_REGIME_SLABS_BELOW60

  const slabTax = applySlabs(taxableIncome, slabs)

  // Section 87A rebate — old regime (not for super senior citizens)
  let rebate = 0
  if (!isSuperSenior && taxableIncome <= REBATE_87A_OLD_INCOME_LIMIT) {
    rebate = Math.min(slabTax, REBATE_87A_OLD_MAX)
  }

  const taxAfterRebate = Math.max(0, slabTax - rebate)
  const cess    = Math.round(taxAfterRebate * CESS_RATE)
  const totalTax = taxAfterRebate + cess

  return {
    grossIncome,
    taxableIncome,
    standardDeduction: STANDARD_DEDUCTION_OLD,
    professionalTaxDeduction: professionalTax,
    hraExemption,
    deduction80C,
    deduction80DSelf,
    deduction80DParents,
    deduction80D,
    deductionHomeLoanInterest,
    deduction80TTA_TTB,
    deductionPersonalNPS,
    employerNPSDeduction: employerNPS,
    slabTax,
    rebate,
    cess,
    totalTax,
  }
}

// ─── Step 4: Compare and Recommend ────────────────────────────────────────────

export function compareRegimes(newResult, oldResult) {
  if (newResult.totalTax <= oldResult.totalTax) {
    return {
      recommended: 'new',
      savings: oldResult.totalTax - newResult.totalTax,
    }
  }
  return {
    recommended: 'old',
    savings: newResult.totalTax - oldResult.totalTax,
  }
}

// ─── Step 5: TDS Position ─────────────────────────────────────────────────────

export function calculateTDSPosition(totalTax, tdsDeducted) {
  const tds = n(tdsDeducted)
  const diff = tds - totalTax
  if (diff > 0) return { type: 'refund',  amount: diff }
  if (diff < 0) return { type: 'payable', amount: -diff }
  return { type: 'settled', amount: 0 }
}

// ─── Master compute function ───────────────────────────────────────────────────

export function computeTax(data) {
  const newRegime = calculateNewRegimeTax(data)
  const oldRegime = calculateOldRegimeTax(data)
  const { recommended, savings } = compareRegimes(newRegime, oldRegime)
  const recommendedTax = recommended === 'new' ? newRegime.totalTax : oldRegime.totalTax
  const employerTDS = data.hasTDS ? n(data.tdsDeducted) : 0
  const bankTDS = n(data.bankTDS)
  const tdsAmount = employerTDS + bankTDS
  const tds = calculateTDSPosition(recommendedTax, tdsAmount)

  return {
    newRegime,
    oldRegime,
    recommended,
    savings,
    tds,
    tdsDeducted: tdsAmount,
    employerTDS,
    bankTDS,
  }
}
