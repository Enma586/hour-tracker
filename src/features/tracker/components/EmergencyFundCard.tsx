import { useState } from 'react'
import { useBalance } from '../hooks'

const FUND_LIMIT = 1000

export function EmergencyFundCard() {
  const { balance, updateEmergencyFund, updateTotal, isProcessing } = useBalance()
  const [editMode, setEditMode] = useState(false)
  const [input, setInput] = useState('')

  const percent = Math.min(Math.round((balance.emergencyFund / FUND_LIMIT) * 100), 100)
  const remaining = FUND_LIMIT - balance.emergencyFund

  async function handleSave() {
    const val = parseFloat(input)
    if (isNaN(val) || val < 0) return
    const clamped = Math.min(val, FUND_LIMIT)
    const diff = clamped - balance.emergencyFund
    await Promise.all([
      updateEmergencyFund(clamped),
      updateTotal(balance.total - diff),
    ])
    setEditMode(false)
  }

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M6 16v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Emergency Fund</span>
        <span className="text-[8px] text-white/30 font-semibold uppercase tracking-widest ml-auto">Cap $1,000</span>
      </div>

      {editMode ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number" step="0.01" placeholder="0.00"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 text-sm pointer-events-none">$</span>
          </div>
          <p className="text-[9px] text-white/30 font-inter">Max $1,000.00</p>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={isProcessing} className="flex-1 bg-white text-[#0B2415] font-plus font-bold py-4 rounded-2xl hover:bg-white/95 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50">
              {isProcessing ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)} className="px-6 py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 cursor-pointer">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-plus font-extrabold tracking-tighter text-white">
              ${balance.emergencyFund.toFixed(2)}
            </span>
            <span className="text-sm text-white/40 font-inter">$1,000 max</span>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full glass-dark rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-semibold uppercase tracking-widest text-white/40">
              <span>{percent}% saved</span>
              <span>${remaining.toFixed(2)} to cap</span>
            </div>
          </div>

          <button
            onClick={() => { setInput(balance.emergencyFund.toString()); setEditMode(true) }}
            className="w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all border-t border-white/10 mt-2 cursor-pointer"
          >
            + Edit Fund
          </button>
        </div>
      )}
    </section>
  )
}
