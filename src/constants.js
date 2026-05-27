// ─── FY 2025-26 Tax Constants ────────────────────────────────────────────────
// All values in INR. Source: Finance Act 2025 / Budget 2025-26.

// Standard Deductions (Section 16(ia))
export const STANDARD_DEDUCTION_NEW = 75_000
export const STANDARD_DEDUCTION_OLD = 50_000

// Professional Tax cap (Section 16(iii)) — both regimes
export const PROF_TAX_CAP = 2_500

// Employer NPS deduction cap (Section 80CCD(2)) — both regimes
export const EMPLOYER_NPS_PCT_OF_BASIC = 0.14   // 14% of basic salary

// 80C combined cap — old regime only
export const CAP_80C = 1_50_000

// Personal NPS (Section 80CCD(1B)) — old regime only, over and above 80C
export const CAP_80CCD1B = 50_000

// 80D limits — old regime only
export const CAP_80D_SELF_BELOW60  = 25_000
export const CAP_80D_SELF_ABOVE60  = 50_000    // user is 60+
export const CAP_80D_PARENTS_BELOW60 = 25_000
export const CAP_80D_PARENTS_ABOVE60  = 50_000  // parents are 60+

// Home loan interest — Section 24(b), old regime only, self-occupied
export const CAP_24B = 2_00_000

// Savings interest deduction — old regime only
export const CAP_80TTA = 10_000   // below 60, savings account only
export const CAP_80TTB = 50_000   // 60+, savings + FD interest combined

// Section 87A Rebate — New Regime
export const REBATE_87A_NEW_INCOME_LIMIT = 12_00_000
export const REBATE_87A_NEW_MAX          = 60_000
// Marginal relief threshold — new regime
export const MARGINAL_RELIEF_THRESHOLD   = 12_00_000

// Section 87A Rebate — Old Regime (NOT available for super senior 80+)
export const REBATE_87A_OLD_INCOME_LIMIT = 5_00_000
export const REBATE_87A_OLD_MAX          = 12_500

// Cess — both regimes, applied after rebate
export const CESS_RATE = 0.04

// HRA percentages for exemption calculation
export const HRA_METRO_PCT    = 0.50   // metro cities
export const HRA_NONMETRO_PCT = 0.40   // all other cities
// Metro cities for FY 2025-26: Delhi, Mumbai, Kolkata, Chennai only
// Bangalore, Hyderabad, Pune, Ahmedabad become metro from FY 2026-27

// ─── Tax Slabs ────────────────────────────────────────────────────────────────
// Each slab: { upTo: number | null, rate: number }
// upTo: null means "above this" (highest slab)

export const NEW_REGIME_SLABS = [
  { upTo: 4_00_000,  rate: 0.00 },
  { upTo: 8_00_000,  rate: 0.05 },
  { upTo: 12_00_000, rate: 0.10 },
  { upTo: 16_00_000, rate: 0.15 },
  { upTo: 20_00_000, rate: 0.20 },
  { upTo: 24_00_000, rate: 0.25 },
  { upTo: null,      rate: 0.30 },
]

export const OLD_REGIME_SLABS_BELOW60 = [
  { upTo: 2_50_000,  rate: 0.00 },
  { upTo: 5_00_000,  rate: 0.05 },
  { upTo: 10_00_000, rate: 0.20 },
  { upTo: null,      rate: 0.30 },
]

export const OLD_REGIME_SLABS_SENIOR = [   // 60–79 years
  { upTo: 3_00_000,  rate: 0.00 },
  { upTo: 5_00_000,  rate: 0.05 },
  { upTo: 10_00_000, rate: 0.20 },
  { upTo: null,      rate: 0.30 },
]

export const OLD_REGIME_SLABS_SUPER_SENIOR = [  // 80+ years
  { upTo: 5_00_000,  rate: 0.00 },
  { upTo: 10_00_000, rate: 0.20 },
  { upTo: null,      rate: 0.30 },
]

// Old regime basic exemption limits (for reference / display)
export const BASIC_EXEMPTION_OLD = {
  below60:     2_50_000,
  senior:      3_00_000,
  superSenior: 5_00_000,
}
