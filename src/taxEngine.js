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
  RATE_STCG_EQUITY, RATE_LTCG, LTCG_EXEMPTION_LIMIT,
  SURCHARGE_SLABS_NEW, SURCHARGE_SLABS_OLD
} from './constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function n(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

export function applySlabs(income, slabs) {
  if (income <= 0) return 0
  let tax = 0
  let prev = 0

  for (const { upTo, rate } of slabs) {
    if (upTo === null) {
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

function getSurchargeRate(income, slabs) {
  for (const slab of slabs) {
    if (income > slab.threshold) return slab.rate;
  }
  return 0;
}

// ─── Step 1: Gross Total Income ───────────────────────────────────────────────

export function calculateGrossIncome(data) {
  const takeHome  = n(data.takeHomeSalaryMonthly) * 12
  const bonus     = n(data.bonus)
  const fdInterest = n(data.fdInterest)
  const savingsInterest = n(data.savingsInterest)
  const freelance = n(data.freelanceIncome)
  const business = n(data.businessIncome)
  const digital = n(data.digitalIncome)
  const stcgProp = n(data.stcgProperty) // STCG on property is taxed at slab rates
  return takeHome + bonus + fdInterest + savingsInterest + freelance + business + digital + stcgProp
}

export function calculateCapitalGains(data) {
  const stcgEq = n(data.stcgEquity)
  const ltcgEq = n(data.ltcgEquity)
  const ltcgProp = n(data.ltcgProperty)

  const taxableLtcgEq = Math.max(0, ltcgEq - LTCG_EXEMPTION_LIMIT)
  
  const taxStcgEq = Math.round(stcgEq * RATE_STCG_EQUITY)
  const taxLtcgEq = Math.round(taxableLtcgEq * RATE_LTCG)
  const taxLtcgProp = Math.round(ltcgProp * RATE_LTCG)
  
  const totalSpecialIncome = stcgEq + ltcgEq + ltcgProp
  const totalSpecialTax = taxStcgEq + taxLtcgEq + taxLtcgProp

  return {
    stcgEq, ltcgEq, ltcgProp,
    taxableLtcgEq,
    taxStcgEq, taxLtcgEq, taxLtcgProp,
    totalSpecialIncome, totalSpecialTax
  }
}

// ─── HRA Exemption ────────────────────────────────────────────────────────────

export function calculateHRAExemption(data) {
  if (!data.paysRent || !data.hasHRA || n(data.hraMonthly) === 0) return 0

  const annualHRAReceived = n(data.hraMonthly) * 12
  const annualBasic       = n(data.basicSalaryMonthly) * 12
  const annualRentPaid    = n(data.monthlyRent) * 12
  const hraPct = data.cityType === 'metro' ? HRA_METRO_PCT : HRA_NONMETRO_PCT

  const condition1 = annualHRAReceived
  const condition2 = hraPct * annualBasic
  const condition3 = annualRentPaid - 0.10 * annualBasic

  return Math.round(Math.max(0, Math.min(condition1, condition2, condition3)))
}

// ─── Step 2: New Regime ───────────────────────────────────────────────────────

export function calculateNewRegimeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const cg = calculateCapitalGains(data)
  const annualBasic = n(data.basicSalaryMonthly) * 12
  
  const employerNPS = data.hasEmployerNPS
    ? Math.min(n(data.employerNPS), EMPLOYER_NPS_PCT_OF_BASIC * annualBasic)
    : 0

  const taxableNormalIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION_NEW - employerNPS)
  const totalIncomeForSurcharge = taxableNormalIncome + cg.totalSpecialIncome

  const slabTax = applySlabs(taxableNormalIncome, NEW_REGIME_SLABS)
  
  // Rebate applies to total income
  let rebate = 0
  if (totalIncomeForSurcharge <= REBATE_87A_NEW_INCOME_LIMIT) {
    // Rebate covers slab tax and special tax
    rebate = Math.min(slabTax + cg.totalSpecialTax, REBATE_87A_NEW_MAX)
  }

  // Calculate tax before surcharge
  let taxAfterRebate = Math.max(0, slabTax + cg.totalSpecialTax - rebate)
  
  // Marginal relief near 12L
  let marginalRelief = 0
  if (totalIncomeForSurcharge > MARGINAL_RELIEF_THRESHOLD && rebate === 0) {
    const excess = totalIncomeForSurcharge - MARGINAL_RELIEF_THRESHOLD
    if (taxAfterRebate > excess) {
      marginalRelief = taxAfterRebate - excess
      taxAfterRebate = excess
    }
  }

  // Surcharge calculation
  const surchargeRate = getSurchargeRate(totalIncomeForSurcharge, SURCHARGE_SLABS_NEW)
  let surcharge = Math.round(taxAfterRebate * surchargeRate)
  
  // Simple Marginal Relief for Surcharge
  let marginalReliefSurcharge = 0
  if (surchargeRate > 0) {
    const threshold = SURCHARGE_SLABS_NEW.find(s => totalIncomeForSurcharge > s.threshold).threshold
    const rateAtThreshold = getSurchargeRate(threshold, SURCHARGE_SLABS_NEW)
    
    // Exact tax at threshold requires a full recalculation. We'll approximate the tax at threshold 
    // by assuming the excess income is taxed at the highest slab rate + special rate mix. 
    // For exactness, a separate compute function is needed, but we use a simplified fallback.
    // If tax + surcharge > tax at threshold + (income - threshold)
    const excessIncome = totalIncomeForSurcharge - threshold
    const taxAtThreshold = taxAfterRebate - (excessIncome * 0.30) // Appx tax at threshold
    const totalTaxAtThreshold = taxAtThreshold + (taxAtThreshold * rateAtThreshold)
    
    const currentTotalTax = taxAfterRebate + surcharge
    const maxAllowedTax = totalTaxAtThreshold + excessIncome
    
    if (currentTotalTax > maxAllowedTax && maxAllowedTax > 0) {
      marginalReliefSurcharge = currentTotalTax - maxAllowedTax
      surcharge -= marginalReliefSurcharge
    }
  }

  const taxAfterSurcharge = taxAfterRebate + surcharge
  const cess = Math.round(taxAfterSurcharge * CESS_RATE)
  const totalTax = taxAfterSurcharge + cess

  return {
    grossIncome,
    cg,
    taxableIncome: taxableNormalIncome,
    totalIncomeForSurcharge,
    standardDeduction: STANDARD_DEDUCTION_NEW,
    professionalTaxDeduction: 0,
    employerNPSDeduction: employerNPS,
    slabTax,
    specialTax: cg.totalSpecialTax,
    rebate,
    marginalRelief,
    surcharge,
    marginalReliefSurcharge,
    cess,
    totalTax,
  }
}

// ─── Step 3: Old Regime ───────────────────────────────────────────────────────

export function calculateOldRegimeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const cg = calculateCapitalGains(data)
  const annualBasic = n(data.basicSalaryMonthly) * 12
  const isAbove60 = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  const isSuperSenior = data.ageGroup === 'superSenior'

  const professionalTax = Math.min(n(data.professionalTax), PROF_TAX_CAP)
  const hraExemption = calculateHRAExemption(data)
  
  const total80C = data.has80CItems.reduce((sum, key) => sum + n(data.investments80C[key]), 0)
  const deduction80C = Math.min(total80C, CAP_80C)

  const selfCap = isAbove60 ? CAP_80D_SELF_ABOVE60 : CAP_80D_SELF_BELOW60
  const deduction80DSelf = data.hasSelfInsurance ? Math.min(n(data.selfInsurancePremium), selfCap) : 0
  const parentCap = data.parentsAbove60 ? CAP_80D_PARENTS_ABOVE60 : CAP_80D_PARENTS_BELOW60
  const deduction80DParents = data.hasParentInsurance ? Math.min(n(data.parentInsurancePremium), parentCap) : 0
  const deduction80D = deduction80DSelf + deduction80DParents

  const deductionHomeLoanInterest = (data.hasHomeLoan && data.loanOwnership !== 'other') ? Math.min(n(data.homeLoanInterest), CAP_24B) : 0

  let deduction80TTA_TTB = 0
  if (isAbove60) {
    deduction80TTA_TTB = Math.min(n(data.savingsInterest) + n(data.fdInterest), CAP_80TTB)
  } else {
    deduction80TTA_TTB = Math.min(n(data.savingsInterest), CAP_80TTA)
  }

  const deductionPersonalNPS = data.hasPersonalNPS ? Math.min(n(data.personalNPS), CAP_80CCD1B) : 0
  const employerNPS = data.hasEmployerNPS ? Math.min(n(data.employerNPS), EMPLOYER_NPS_PCT_OF_BASIC * annualBasic) : 0

  const totalDeductions = STANDARD_DEDUCTION_OLD + professionalTax + hraExemption + deduction80C + deduction80D + deductionHomeLoanInterest + deduction80TTA_TTB + deductionPersonalNPS + employerNPS

  const taxableNormalIncome = Math.max(0, grossIncome - totalDeductions)
  const totalIncomeForSurcharge = taxableNormalIncome + cg.totalSpecialIncome

  let slabs
  if (isSuperSenior) slabs = OLD_REGIME_SLABS_SUPER_SENIOR
  else if (isAbove60) slabs = OLD_REGIME_SLABS_SENIOR
  else slabs = OLD_REGIME_SLABS_BELOW60

  const slabTax = applySlabs(taxableNormalIncome, slabs)

  let rebate = 0
  if (!isSuperSenior && totalIncomeForSurcharge <= REBATE_87A_OLD_INCOME_LIMIT) {
    rebate = Math.min(slabTax + cg.totalSpecialTax, REBATE_87A_OLD_MAX)
  }

  let taxAfterRebate = Math.max(0, slabTax + cg.totalSpecialTax - rebate)

  const surchargeRate = getSurchargeRate(totalIncomeForSurcharge, SURCHARGE_SLABS_OLD)
  let surcharge = Math.round(taxAfterRebate * surchargeRate)
  
  let marginalReliefSurcharge = 0
  if (surchargeRate > 0) {
    const threshold = SURCHARGE_SLABS_OLD.find(s => totalIncomeForSurcharge > s.threshold).threshold
    const rateAtThreshold = getSurchargeRate(threshold, SURCHARGE_SLABS_OLD)
    const excessIncome = totalIncomeForSurcharge - threshold
    const taxAtThreshold = Math.max(0, taxAfterRebate - (excessIncome * 0.30))
    const totalTaxAtThreshold = taxAtThreshold + (taxAtThreshold * rateAtThreshold)
    
    const currentTotalTax = taxAfterRebate + surcharge
    const maxAllowedTax = totalTaxAtThreshold + excessIncome
    
    if (currentTotalTax > maxAllowedTax && maxAllowedTax > 0) {
      marginalReliefSurcharge = currentTotalTax - maxAllowedTax
      surcharge -= marginalReliefSurcharge
    }
  }

  const taxAfterSurcharge = taxAfterRebate + surcharge
  const cess = Math.round(taxAfterSurcharge * CESS_RATE)
  const totalTax = taxAfterSurcharge + cess

  return {
    grossIncome,
    cg,
    taxableIncome: taxableNormalIncome,
    totalIncomeForSurcharge,
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
    specialTax: cg.totalSpecialTax,
    rebate,
    surcharge,
    marginalReliefSurcharge,
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
