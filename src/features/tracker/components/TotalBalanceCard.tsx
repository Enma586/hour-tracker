import { useState } from 'react'
import { useBalance } from '../hooks'

export function TotalBalanceCard() {
  const { balance, isEditable, updateTotal, isProcessing } = useBalance()
  const [editMode, setEditMode] = useState(false)
  const [input, setInput] = useState('')

  async function handleSave() {
    const val = parseFloat(input)
    if (isNaN(val) || val < 0) return
    await updateTotal(val)
    setEditMode(false)
  }

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Total Balance</span>
      </div>

      {editMode && isEditable ? (
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
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={isProcessing} className="flex-1 bg-white text-[#0B2415] font-plus font-bold py-4 rounded-2xl hover:bg-white/95 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50">
              {isProcessing ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)} className="px-6 py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 cursor-pointer">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <span className="text-5xl font-plus font-extrabold tracking-tighter text-white block">
            ${balance.total.toFixed(2)}
          </span>
          {isEditable && (
            <button
              onClick={() => { setInput(balance.total.toString()); setEditMode(true) }}
              className="w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all border-t border-white/10 mt-2 cursor-pointer"
            >
              + Edit Total
            </button>
          )}
          {isEditable && (
            <p className="text-[9px] text-white/40 font-inter">Editable until midnight (Fri)</p>
          )}
        </div>
      )}
    </section>
  )
}
