import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import ConfusedLink from '../ConfusedLink'
import CommonQuestions from '../CommonQuestions'
import { useRef } from 'react'

export default function S07_SideIncome({ data, update, goNext, goBack, reset, step, progressStep, TOTAL_PROGRESS }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  function handleNext() {
    if (data.hasSideIncome === null) {
      setErrors({ toggle: true })
      return
    }

    if (data.hasSideIncome) {
      if (!data.freelanceIncome && !data.businessIncome && !data.digitalIncome) {
        setErrors({ amount: 'Please enter at least one income amount, or select No.' })
        return
      }
    } else {
      update({ freelanceIncome: '', businessIncome: '', digitalIncome: '' })
    }

    setErrors({})
    goNext()
  }

  const QUESTIONS = [
    { q: "What is freelance income?", a: "Any money earned from freelance work, consulting, or gig work (like Upwork or Fiverr)." },
    { q: "What counts as digital income?", a: "Income from YouTube, blogging, affiliate marketing, or selling digital products." },
    { q: "How is this taxed?", a: "In this calculator, these incomes are simply added to your total gross income and taxed at the normal slab rates. Real-world filing for these requires ITR-3 or ITR-4, which may have presumptive taxation rules." }
  ]

  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Side Income">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">💼</div>
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Side Incomes</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Do you earn money from a side hustle or business?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Freelance, business, and digital incomes are taxed alongside your salary. <ConfusedLink faqRef={faqRef} label="What counts?" />
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { update({ hasSideIncome: true }); setErrors({}) }}
              className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${data.hasSideIncome === true ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.hasSideIncome === true ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                  {data.hasSideIncome === true && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-semibold ${data.hasSideIncome === true ? 'text-indigo-700' : 'text-gray-700'}`}>Yes, I do</span>
              </div>
            </button>
            <button
              onClick={() => { update({ hasSideIncome: false }); setErrors({}) }}
              className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${data.hasSideIncome === false ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.hasSideIncome === false ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                  {data.hasSideIncome === false && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-sm font-semibold ${data.hasSideIncome === false ? 'text-indigo-700' : 'text-gray-700'}`}>No, just salary</span>
              </div>
            </button>
          </div>
          {errors.toggle && <p className="text-red-600 text-xs font-medium reveal">Please select Yes or No.</p>}

          {data.hasSideIncome && (
            <div className="reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <NumberInput
                id="freelance"
                label="Freelance or Consulting Income (Annual)"
                value={data.freelanceIncome}
                onChange={val => { update({ freelanceIncome: val }); setErrors({}) }}
                placeholder="0"
              />
              <NumberInput
                id="business"
                label="Business Income (Annual)"
                value={data.businessIncome}
                onChange={val => { update({ businessIncome: val }); setErrors({}) }}
                placeholder="0"
              />
              <NumberInput
                id="digital"
                label="Digital Income (YouTube, Blogging, etc.) (Annual)"
                value={data.digitalIncome}
                onChange={val => { update({ digitalIncome: val }); setErrors({}) }}
                placeholder="0"
              />
              {errors.amount && <p className="text-red-600 text-xs font-medium">{errors.amount}</p>}
            </div>
          )}
        </div>

        <button onClick={handleNext} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200">
          Continue →
        </button>

        <CommonQuestions ref={faqRef} questions={QUESTIONS} />
      </div>
    </StepWrapper>
  )
}
