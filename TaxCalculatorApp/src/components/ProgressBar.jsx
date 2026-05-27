export default function ProgressBar({ current, total, stepName }) {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Step counter + name */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-gray-700">
          Step {current} of {total}
        </span>
        {stepName && (
          <>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-xs text-gray-500 truncate max-w-[160px] hidden sm:inline">{stepName}</span>
          </>
        )}
      </div>
      {/* Dot progress */}
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < current
                ? 'w-2 h-2 bg-indigo-600'
                : i === current
                  ? 'w-2 h-2 bg-indigo-300'
                  : 'w-1.5 h-1.5 bg-gray-200'
            }`}
            role="progressbar"
            aria-valuenow={i < current ? 100 : 0}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        ))}
      </div>
    </div>
  )
}
