import { useState } from 'react'
import S01_Landing from './components/steps/S01_Landing'
import S02_FinancialYear from './components/steps/S02_FinancialYear'
import S03_AgeGroup from './components/steps/S03_AgeGroup'
import S04_SalaryDetails from './components/steps/S04_SalaryDetails'
import S05_SalaryComponents from './components/steps/S05_SalaryComponents'
import S06_OtherIncome from './components/steps/S06_OtherIncome'
import S07_PaysRent from './components/steps/S07_PaysRent'
import S08_RentDetails from './components/steps/S08_RentDetails'
import S09_TaxSavingInvestments from './components/steps/S09_TaxSavingInvestments'
import S10_HealthInsurance from './components/steps/S10_HealthInsurance'
import S11_HomeLoan from './components/steps/S11_HomeLoan'
import S12_TDS from './components/steps/S12_TDS'
import S13_Calculating from './components/steps/S13_Calculating'
import S14_Results from './components/steps/S14_Results'

// Steps that count toward the visible progress bar (excludes landing, FY, animation, results)
// Steps 3–12 = 10 input steps shown in progress
const PROGRESS_STEPS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const TOTAL_PROGRESS = PROGRESS_STEPS.length

export const INITIAL_STATE = {
  fy: '2025-26',
  ageGroup: null,            // 'below60' | 'senior' | 'superSenior'
  basicSalaryMonthly: '',
  takeHomeSalaryMonthly: '',
  hasBonus: null,
  bonus: '',
  hasHRA: false,
  hraMonthly: '',
  hasProfTax: false,
  professionalTax: '',
  hasEmployerNPS: false,
  employerNPS: '',
  hasOtherIncome: null,
  fdInterest: '',
  savingsInterest: '',
  paysRent: null,
  monthlyRent: '',
  cityType: null,            // 'metro' | 'nonMetro'
  hasHRAInSalary: null,
  investments80C: {
    epf: '',
    lic: '',
    ppf: '',
    elss: '',
    tuition: '',
    homeLoanPrincipal: '',
    nsc: '',
  },
  has80CItems: [],           // which 80C checkboxes are selected
  hasPersonalNPS: null,
  personalNPS: '',
  hasSelfInsurance: null,
  selfInsurancePremium: '',
  hasParentInsurance: null,
  parentInsurancePremium: '',
  parentsAbove60: null,
  hasHomeLoan: null,
  loanOwnership: null,       // 'own' | 'joint' | 'other'
  homeLoanInterest: '',
  hasTDS: null,
  tdsDeducted: '',
  bankTDS: '',
}

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_STATE)
  const [results, setResults] = useState(null)

  function update(fields) {
    setData(prev => ({ ...prev, ...fields }))
  }

  function goNext() {
    setStep(s => s + 1)
  }

  function goBack() {
    setStep(s => Math.max(1, s - 1))
  }

  function skipTo(targetStep) {
    setStep(targetStep)
  }

  function reset() {
    setData(INITIAL_STATE)
    setResults(null)
    setStep(1)
  }

  // Progress for steps 3–12 (10 input steps)
  const progressStep = PROGRESS_STEPS.indexOf(step) + 1
  const showProgress = PROGRESS_STEPS.includes(step)

  const sharedProps = { data, update, goNext, goBack, skipTo, reset, step, progressStep, showProgress, TOTAL_PROGRESS }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {step === 1  && <S01_Landing {...sharedProps} />}
      {step === 2  && <S02_FinancialYear {...sharedProps} />}
      {step === 3  && <S03_AgeGroup {...sharedProps} />}
      {step === 4  && <S04_SalaryDetails {...sharedProps} />}
      {step === 5  && <S05_SalaryComponents {...sharedProps} />}
      {step === 6  && <S06_OtherIncome {...sharedProps} />}
      {step === 7  && <S07_PaysRent {...sharedProps} />}
      {step === 8  && <S08_RentDetails {...sharedProps} />}
      {step === 9  && <S09_TaxSavingInvestments {...sharedProps} />}
      {step === 10 && <S10_HealthInsurance {...sharedProps} />}
      {step === 11 && <S11_HomeLoan {...sharedProps} />}
      {step === 12 && <S12_TDS {...sharedProps} />}
      {step === 13 && <S13_Calculating {...sharedProps} setResults={setResults} />}
      {step === 14 && <S14_Results {...sharedProps} results={results} reset={reset} />}
    </div>
  )
}
