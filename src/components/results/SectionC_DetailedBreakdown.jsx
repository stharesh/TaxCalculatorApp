import { useState } from 'react'
import { fmt } from '../../utils'
import {
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS_BELOW60,
  OLD_REGIME_SLABS_SENIOR,
  OLD_REGIME_SLABS_SUPER_SENIOR,
} from '../../constants'

// ─── Slab helpers ──────────────────────────────────────────────────────────────

function fmtN(n) {
  return Number(n).toLocaleString('en-IN')
}

function getOldSlabs(ageGroup) {
  if (ageGroup === 'senior') return OLD_REGIME_SLABS_SENIOR
  if (ageGroup === 'superSenior') return OLD_REGIME_SLABS_SUPER_SENIOR
  return OLD_REGIME_SLABS_BELOW60
}

function fmtL(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  return fmtN(n)
}

function slabLabel(prev, upTo) {
  if (prev === 0) return upTo === null ? 'All' : `0 – ${fmtL(upTo)}`
  return upTo === null
    ? `${fmtL(prev)}+`
    : `${fmtL(prev)} – ${fmtL(upTo)}`
}

function computeSlabRows(taxableIncome, slabs) {
  const rows = []
  let prev = 0
  for (const slab of slabs) {
    const upper = slab.upTo === null ? Math.max(taxableIncome, prev) : slab.upTo
    const taxableInBand = Math.max(0, Math.min(taxableIncome, upper) - prev)
    const tax = Math.round(taxableInBand * slab.rate)
    rows.push({
      label: slabLabel(prev, slab.upTo),
      rate: `${Math.round(slab.rate * 100)}%`,
      tax,
      active: taxableInBand > 0 && slab.rate > 0,
    })
    prev = slab.upTo === null ? upper : slab.upTo
  }
  return rows
}

// ─── Layout sub-components ───────────────────────────────────────────────────

function SectionHeader({ step, label }) {
  return (
    <div className="pt-4 pb-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex-shrink-0">
          {step}
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  )
}

function Row({ label, newVal, oldVal, deduction, dimNew }) {
  return (
    <div className="flex">
      <div className="flex-1 py-1.5 pr-3 text-xs text-gray-600 pl-7">{label}</div>
      <div className={`w-[27%] shrink-0 py-1.5 px-2 text-xs text-right
        ${dimNew ? 'text-gray-300' : deduction ? 'text-green-700' : 'text-gray-700'}`}>
        {dimNew ? '——' : newVal}
      </div>
      <div className={`w-[27%] shrink-0 py-1.5 pl-2 text-xs text-right
        ${deduction ? 'text-green-700' : 'text-gray-700'}`}>
        {oldVal}
      </div>
    </div>
  )
}

function ResultRow({ label, newVal, oldVal, isWinner, final }) {
  const isNew = isWinner === 'new'
  const isOld = isWinner === 'old'

  return (
    <div className="pt-2 pb-1">
      <div className={`rounded-lg py-2.5 flex items-center ${final ? 'bg-gray-100' : 'bg-indigo-50'}`}>
        <div className={`flex-1 pl-7 pr-3 text-xs font-semibold ${final ? 'text-gray-700' : 'text-indigo-800'}`}>
          = {label}
        </div>
        <div className={`w-[27%] shrink-0 px-2 text-xs font-bold text-right
          ${final && isNew ? 'text-green-700 text-sm' : final ? 'text-gray-700' : 'text-indigo-900'}`}>
          {newVal}
        </div>
        <div className={`w-[27%] shrink-0 pl-2 pr-3 text-xs font-bold text-right
          ${final && isOld ? 'text-green-700 text-sm' : final ? 'text-gray-700' : 'text-indigo-900'}`}>
          {oldVal}
        </div>
      </div>
    </div>
  )
}

// ─── Mini slab table (one regime) ──────────────────────────────────────────────

function SlabTable({ label, slabRows, totalTax, isWinner }) {
  return (
    <div className={`rounded-lg border overflow-hidden flex flex-col ${isWinner ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200 bg-gray-50/50'}`}>
      <div className={`px-2 py-1.5 border-b ${isWinner ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-100'}`}>
        <p className={`text-xs font-semibold ${isWinner ? 'text-indigo-700' : 'text-gray-600'}`}>
          {label} {isWinner && <span className="text-green-600">✓</span>}
        </p>
      </div>
      {/* Slab rows */}
      <div className="flex-1 divide-y divide-gray-100">
        {slabRows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center px-2 py-1 text-xs gap-1
              ${row.active ? 'bg-indigo-50/60 text-indigo-700 font-medium' : 'text-gray-400'}`}
          >
            <span className="flex-1 whitespace-nowrap">{row.label}</span>
            <span className="w-8 text-center shrink-0">{row.rate}</span>
            <span className="w-16 text-right shrink-0">₹{fmtN(row.tax)}</span>
          </div>
        ))}
      </div>
      {/* Total — pinned at bottom */}
      <div className={`px-2 py-2 border-t-2 ${isWinner ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-100'} flex justify-between items-center`}>
        <span className={`text-xs font-bold ${isWinner ? 'text-indigo-700' : 'text-gray-700'}`}>Total</span>
        <span className={`text-sm font-bold ${isWinner ? 'text-indigo-800' : 'text-gray-800'}`}>₹{fmtN(totalTax)}</span>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function SectionC_DetailedBreakdown({ results, data }) {
  const [open, setOpen] = useState(false)
  const { newRegime: n, oldRegime: o, recommended } = results

  const isNewWinner = recommended === 'new'

  const newTaxAfterRebate = Math.max(0, n.slabTax - n.rebate - (n.marginalRelief || 0))
  const oldTaxAfterRebate = Math.max(0, o.slabTax - o.rebate)

  const newSlabRows = computeSlabRows(n.taxableIncome, NEW_REGIME_SLABS)
  const oldSlabs = getOldSlabs(data?.ageGroup)
  const oldSlabRows = computeSlabRows(o.taxableIncome, oldSlabs)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(x => !x)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-800">See detailed comparison</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Column headers */}
          <div className="flex mt-3 mb-1">
            <div className="flex-1 pl-7" />
            <div className={`w-[27%] shrink-0 px-2 text-xs font-semibold text-right ${isNewWinner ? 'text-indigo-600' : 'text-gray-400'}`}>
              New Regime {isNewWinner && '✓'}
            </div>
            <div className={`w-[27%] shrink-0 pl-2 text-xs font-semibold text-right ${!isNewWinner ? 'text-indigo-600' : 'text-gray-400'}`}>
              Old Regime {!isNewWinner && '✓'}
            </div>
          </div>

          {/* Step 1: Income */}
          <SectionHeader step="1" label="Your total income" />
          <Row label="Gross income (salary + bonus + other)" newVal={fmt(n.grossIncome)} oldVal={fmt(o.grossIncome)} />

          {/* Step 2: Deductions */}
          <SectionHeader step="2" label="Subtract deductions" />
          <Row
            label="Standard deduction (automatic)"
            newVal={`− ${fmt(n.standardDeduction)}`}
            oldVal={`− ${fmt(o.standardDeduction)}`}
            deduction
          />
          {o.professionalTaxDeduction > 0 && (
            <Row
              label="Professional tax (old regime only)"
              newVal=""
              oldVal={`− ${fmt(o.professionalTaxDeduction)}`}
              deduction
              dimNew
            />
          )}
          <Row
            label="HRA exemption (old regime only)"
            newVal=""
            oldVal={o.hraExemption > 0 ? `− ${fmt(o.hraExemption)}` : '₹0'}
            deduction={o.hraExemption > 0}
            dimNew
          />
          <Row
            label="80C investments — EPF, PPF, ELSS etc."
            newVal=""
            oldVal={o.deduction80C > 0 ? `− ${fmt(o.deduction80C)}` : '₹0'}
            deduction={o.deduction80C > 0}
            dimNew
          />
          {o.deduction80D > 0 && (
            <Row
              label="Health insurance 80D"
              newVal=""
              oldVal={`− ${fmt(o.deduction80D)}`}
              deduction
              dimNew
            />
          )}
          {o.deductionPersonalNPS > 0 && (
            <Row
              label="NPS personal contribution 80CCD(1B)"
              newVal=""
              oldVal={`− ${fmt(o.deductionPersonalNPS)}`}
              deduction
              dimNew
            />
          )}
          {(n.employerNPSDeduction > 0 || o.employerNPSDeduction > 0) && (
            <Row
              label="Employer NPS 80CCD(2)"
              newVal={n.employerNPSDeduction > 0 ? `− ${fmt(n.employerNPSDeduction)}` : '₹0'}
              oldVal={o.employerNPSDeduction > 0 ? `− ${fmt(o.employerNPSDeduction)}` : '₹0'}
              deduction={n.employerNPSDeduction > 0 || o.employerNPSDeduction > 0}
            />
          )}
          {o.deductionHomeLoanInterest > 0 && (
            <Row
              label="Home loan interest Section 24(b)"
              newVal=""
              oldVal={`− ${fmt(o.deductionHomeLoanInterest)}`}
              deduction
              dimNew
            />
          )}
          {o.deduction80TTA_TTB > 0 && (
            <Row
              label="Savings interest 80TTA / 80TTB"
              newVal=""
              oldVal={`− ${fmt(o.deduction80TTA_TTB)}`}
              deduction
              dimNew
            />
          )}

          {/* Step 3: Taxable Income */}
          <SectionHeader step="3" label="Taxable income" />
          <ResultRow
            label="Taxable income"
            newVal={fmt(n.taxableIncome)}
            oldVal={fmt(o.taxableIncome)}
          />

          {/* Step 4: Tax calculation */}
          <SectionHeader step="4" label="Apply tax slabs" />

          {/* ── Side-by-side slab tables ── */}
          <div className="grid grid-cols-2 gap-2 mt-2 mb-3 pl-7">
            <SlabTable
              label="New Regime"
              slabRows={newSlabRows}
              totalTax={n.slabTax}
              isWinner={isNewWinner}
            />
            <SlabTable
              label="Old Regime"
              slabRows={oldSlabRows}
              totalTax={o.slabTax}
              isWinner={!isNewWinner}
            />
          </div>

          {/* ── Adjustments after slabs ── */}
          <Row
            label="Section 87A rebate (government relief)"
            newVal={n.rebate > 0 ? `− ${fmt(n.rebate)}` : '₹0'}
            oldVal={o.rebate > 0 ? `− ${fmt(o.rebate)}` : '₹0'}
            deduction={n.rebate > 0 || o.rebate > 0}
          />
          {n.marginalRelief > 0 && (
            <Row
              label="Marginal relief (near ₹12L boundary)"
              newVal={`− ${fmt(n.marginalRelief)}`}
              oldVal="——"
              deduction
            />
          )}

          {/* Tax after rebate — shown when rebate wipes out tax in either regime */}
          {(n.rebate > 0 || o.rebate > 0) && (
            <div className="flex">
              <div className="flex-1 py-1.5 pr-3 text-xs text-gray-600 pl-7 font-medium">Tax after rebate</div>
              <div className={`w-[27%] shrink-0 py-1.5 px-2 text-xs text-right font-semibold ${newTaxAfterRebate === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                {newTaxAfterRebate === 0 ? '₹0 — no tax' : fmt(newTaxAfterRebate)}
              </div>
              <div className={`w-[27%] shrink-0 py-1.5 pl-2 text-xs text-right font-semibold ${oldTaxAfterRebate === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                {oldTaxAfterRebate === 0 ? '₹0 — no tax' : fmt(oldTaxAfterRebate)}
              </div>
            </div>
          )}

          <Row
            label="4% Health & Education Cess"
            newVal={n.cess > 0 ? fmt(n.cess) : '₹0'}
            oldVal={o.cess > 0 ? fmt(o.cess) : '₹0'}
          />
          {/* Explain why cess is zero when tax after rebate is zero */}
          {(newTaxAfterRebate === 0 || oldTaxAfterRebate === 0) && (
            <div className="pl-7 pb-1">
              <p className="text-xs text-gray-400 italic">
                Cess is 4% of tax after rebate — when tax is zero, cess is also zero.
              </p>
            </div>
          )}

          {/* Final: Total Tax */}
          <div className="pt-1" />
          <ResultRow
            label="Total tax payable"
            newVal={fmt(n.totalTax)}
            oldVal={fmt(o.totalTax)}
            isWinner={recommended}
            final
          />

          <p className="text-xs text-gray-400 mt-3">
            Green amounts (−) reduce your taxable income. Deduction caps already applied.
            "——" = not available in that regime.
          </p>
        </div>
      )}
    </div>
  )
}
