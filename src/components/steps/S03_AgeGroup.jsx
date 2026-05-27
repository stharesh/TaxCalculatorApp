import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import CommonQuestions from '../CommonQuestions'

const AGE_OPTIONS = [
  {
    value: 'below60',
    label: 'Below 60 years',
    description: 'Basic exemption: ₹2,50,000 under old regime',
  },
  {
    value: 'senior',
    label: '60 to 79 years',
    tag: 'Senior Citizen',
    description: 'Basic exemption: ₹3,00,000 under old regime',
  },
  {
    value: 'superSenior',
    label: '80 years or above',
    tag: 'Super Senior Citizen',
    description: 'Basic exemption: ₹5,00,000 under old regime',
  },
]

const QUESTIONS = [
  {
    q: 'Why does age matter for tax?',
    a: 'Under the old regime, senior and super senior citizens get a higher portion of their income tax-free — ₹3 lakh for 60–79 and ₹5 lakh for 80+, compared to ₹2.5 lakh for everyone else. Under the new regime, age makes no difference at all.',
  },
  {
    q: 'I turn 60 this financial year. Which do I pick?',
    a: 'If you turn 60 at any point between April 2025 and March 2026, you qualify as a senior citizen for the entire year. Pick "60 to 79 years".',
  },
  {
    q: 'Does age affect the new regime?',
    a: 'No. New regime slabs are identical for all ages. Age only matters under the old regime.',
  },
]

export default function S03_AgeGroup({ data, update, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  const [error, setError] = useState('')

  function handleSelect(value) {
    update({ ageGroup: value })
    setError('')
  }

  function handleNext() {
    if (!data.ageGroup) {
      setError('Please select your age group to continue.')
      return
    }
    goNext()
  }

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Your Age Group">
      <div className="space-y-4">
        {/* Question */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">🎂</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">About You</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Which age group do you fall in?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your age affects your tax-free limit and some deduction caps. We'll apply the correct rules automatically.
          </p>
        </div>

        {/* Options */}
        <fieldset>
          <legend className="sr-only">Age group</legend>
          <div className="space-y-3">
            {AGE_OPTIONS.map(option => {
              const selected = data.ageGroup === option.value
              return (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${selected
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="ageGroup"
                    value={option.value}
                    checked={selected}
                    onChange={() => handleSelect(option.value)}
                    className="sr-only"
                  />
                  {/* Custom radio */}
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${selected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}
                    aria-hidden="true"
                  >
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${selected ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                      {option.tag && (
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full px-2 py-0.5">
                          {option.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm text-red-600 font-medium">{error}</p>
        )}

        {/* Continue */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue →
        </button>

        <CommonQuestions questions={QUESTIONS} />
      </div>
    </StepWrapper>
  )
}
