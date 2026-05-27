const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9 6 9-6M3 12l9 6 9-6" />
      </svg>
    ),
    title: 'Old vs New Regime Comparison',
    desc: 'See which regime saves you more money.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Exact Amount You Save',
    desc: 'Know your exact savings in rupees.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    title: 'Refund or Tax Due',
    desc: "Know whether you'll get a refund or need to pay more.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    title: 'Plain English, No CA Jargon',
    desc: 'We explain everything in simple terms.',
  },
]

export default function S01_Landing({ goNext }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Top nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">TaxClarity</span>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">FY 2025-26</span>
      </header>

      {/* Hero */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left — copy */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
              Know. Compare. Save.
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
              Find out{' '}
              <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">which tax regime</span>{' '}
              saves you more money this year.
            </h1>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 max-w-md">
              Answer a few simple questions about your salary and expenses.
              We'll compare both tax regimes and show you which one saves you more money — with a clear rupee-by-rupee estimate.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: '⏱', label: '2 min', sub: 'Quick' },
                { icon: '🔒', label: '100% Free', sub: 'No sign-up' },
                { icon: '🛡', label: 'Private', sub: 'No data stored' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-none">{label}</p>
                    <p className="text-xs text-gray-400 leading-none mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 px-7 rounded-2xl text-sm transition-colors shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start calculation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See how it works
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Built for salaried individuals only · FY 2025-26
            </p>
          </div>

          {/* Right — preview card */}
          <div className="relative">
            {/* Soft glow behind card */}
            <div className="absolute inset-0 bg-indigo-100 rounded-3xl blur-3xl opacity-40 scale-95 translate-y-4" aria-hidden="true" />

            <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-6 sm:p-8">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-gray-700">Your Tax Summary</p>
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-full px-3 py-1">
                  You Save ₹18,540
                </span>
              </div>

              {/* Winner verdict */}
              <div className="flex items-start justify-between bg-green-50 border border-green-100 rounded-2xl p-4 mb-5">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Best choice for you</p>
                  <p className="text-xl font-bold text-green-700 leading-tight">New Tax Regime</p>
                  <p className="text-xs text-gray-500 mt-1">You save more with the new regime</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

              {/* Side-by-side regime comparison */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Old Tax Regime</p>
                  <p className="text-2xl font-bold text-gray-900">₹1,45,080</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total tax</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <p className="text-xs text-indigo-600 mb-1">New Tax Regime</p>
                  <p className="text-2xl font-bold text-indigo-700">₹1,26,540</p>
                  <p className="text-xs text-indigo-400 mt-0.5">Total tax</p>
                </div>
              </div>

              {/* Savings banner */}
              <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3 px-4 mb-5">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  You save <span className="font-bold text-green-600">₹18,540</span> with New Tax Regime
                </p>
              </div>

              {/* CTA hint */}
              <div className="flex items-center gap-3 py-3 px-1 text-gray-400 border-t border-gray-100">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs">Break-up, deductions &amp; detailed calculation</p>
                <svg className="w-3.5 h-3.5 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Annotation */}
              <div className="absolute -bottom-8 right-8 hidden sm:block pointer-events-none select-none" aria-hidden="true">
                <p className="text-indigo-400 text-xs italic font-medium" style={{ fontFamily: 'cursive' }}>
                  Get results you can<br />understand, instantly.
                </p>
                <svg className="w-6 h-6 text-indigo-300 ml-auto -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards row */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-2">Everything you need. Nothing you don't.</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Clarity over confusion</h2>
            <p className="text-sm text-gray-500 mt-2">We make tax simple, transparent and stress-free.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  {icon}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Your privacy is our priority</p>
              <p className="text-xs text-gray-500 mt-0.5">We don't store your data. Your calculations are private and secure.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex -space-x-2 flex-shrink-0">
              {['bg-indigo-200', 'bg-green-200', 'bg-amber-200'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-500">Trusted by 10,000+ salaried professionals</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400">
          Built for salaried individuals only · FY 2025-26 · No data saved · Not financial advice
        </p>
      </footer>
    </div>
  )
}
