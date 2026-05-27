import StepWrapper from '../StepWrapper'

export default function S02_FinancialYear({ data, goNext, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step }) {
  return (
    <StepWrapper goBack={goBack} reset={reset} showProgress={showProgress} progressStep={progressStep} TOTAL_PROGRESS={TOTAL_PROGRESS} step={step} data={data} stepName="Financial Year">
      <div className="space-y-4">
        {/* Question */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-sm">📅</span>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Financial Year</p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Which financial year are you calculating tax for?
          </h2>
        </div>

        {/* Option — single, pre-selected, locked */}
        <div>
          <div className="flex items-start gap-3 p-4 bg-indigo-50 border-2 border-indigo-600 rounded-xl">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">FY 2025-26</p>
              <p className="text-xs text-gray-500 mt-0.5">April 2025 to March 2026</p>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            Tax rules, slabs and limits are different every year. We've built this for FY 2025-26.
            Support for FY 2026-27 will be added when the new rules are notified.
          </p>
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={goNext}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue →
        </button>
      </div>
    </StepWrapper>
  )
}
