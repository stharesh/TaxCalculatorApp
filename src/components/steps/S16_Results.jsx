import SectionA_Verdict from '../results/SectionA_Verdict'
import SectionB_TaxSummary from '../results/SectionB_TaxSummary'
import SectionC_DetailedBreakdown from '../results/SectionC_DetailedBreakdown'
import SectionD_Education from '../results/SectionD_Education'
import SectionE_NextSteps from '../results/SectionE_NextSteps'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function S16_Results({ results, data, reset, skipTo }) {
  const contentRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)

  async function handleDownloadPDF() {
    if (!contentRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      // If height is greater than one page, jsPDF handles it by squeezing or we just let it be a long single page.
      // Usually, it's better to add new pages if it's too long, but for a simple export, scaling to width is fine.
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('Tax_Calculation_FY2025_26.pdf')
    } catch (err) {
      console.error("PDF Export failed", err)
    } finally {
      setIsExporting(false)
    }
  }
  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Something went wrong. Please start over.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-tight">TaxClarity</span>
          </button>
          <span className="text-sm font-semibold text-gray-700">Your Tax Result</span>
          <span className="text-xs font-medium text-gray-500 bg-indigo-50 text-indigo-600 rounded-full px-2.5 py-1 ml-auto">
            FY 2025-26
          </span>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 bg-[#FAFAFA]" ref={contentRef}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left — verdict, next steps, education */}
          <div className="lg:col-span-7 space-y-4">
            <SectionA_Verdict results={results} data={data} />
            <SectionE_NextSteps results={results} data={data} />
            <SectionD_Education results={results} data={data} />

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Important disclaimer:</span> This is an estimate based on the information you provided — not exact tax advice.
                Your actual tax may differ due to factors this calculator does not cover, such as rental income or complex business deductions.
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Always verify your numbers with a qualified Chartered Accountant or the official income tax portal
                (<span className="font-medium">incometax.gov.in</span>) before filing your return.
              </p>
            </div>

            {/* Edit / Start Over / PDF */}
            <div className="flex flex-col items-center gap-2 pb-2 mt-4">
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl px-6 py-3 shadow-sm disabled:opacity-70"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {isExporting ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button
                type="button"
                onClick={() => skipTo(4)}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors border border-indigo-200 rounded-xl px-5 py-2 hover:bg-indigo-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Go back and edit my inputs
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors border border-gray-300 rounded-xl px-5 py-2 hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
              <p className="text-xs text-gray-400 mt-1">Nothing is saved — try with different numbers.</p>
            </div>
          </div>

          {/* Right — sticky tax summary + breakdown */}
          <div className="lg:col-span-5">
            <div className="sticky top-16 space-y-4">
              <SectionB_TaxSummary results={results} data={data} />
              <SectionC_DetailedBreakdown results={results} data={data} />

              {/* Trust strip */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { icon: '🛡️', label: 'FY 2025-26 Rules', sub: 'Based on latest tax slabs' },
                  { icon: '🔒', label: 'Your data is private', sub: "We don't store your data" },
                  { icon: '⏱️', label: 'Takes 3–5 minutes', sub: 'Quick & easy process' },
                ].map(item => (
                  <div key={item.label} className="text-center p-2">
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    <p className="text-xs font-semibold text-gray-700 mt-1 leading-tight">{item.label}</p>
                    <p className="text-xs text-gray-400 leading-tight">{item.sub}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-gray-300 pb-2">
                Built for salaried individuals only · FY 2025-26
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
