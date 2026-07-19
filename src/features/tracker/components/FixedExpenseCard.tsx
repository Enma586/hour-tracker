import { useState } from 'react'
import type { FixedExpense } from '../types'
import { FIXED_EXPENSE_CATEGORIES } from '../types'
import { useUpdateFixedExpense, useCreateFixedExpense, useResetFixedExpense } from '../hooks'

interface Props {
  fixedExpenses: FixedExpense[]
}

export function FixedExpenseCard({ fixedExpenses }: Props) {
  const [editName, setEditName] = useState<string | null>(null)
  const [editBudget, setEditBudget] = useState('')
  const [editSpent, setEditSpent] = useState('')
  const [resetTarget, setResetTarget] = useState<string | null>(null)

  const updateFixedExpense = useUpdateFixedExpense()
  const createFixedExpense = useCreateFixedExpense()
  const resetFixedExpense = useResetFixedExpense()

  function getExpense(name: string): FixedExpense | undefined {
    return fixedExpenses.find(e => e.name === name)
  }

  function startEdit(name: string) {
    const expense = getExpense(name)
    setEditName(name)
    setEditBudget(expense?.budgetAmount.toString() ?? '0')
    setEditSpent(expense?.spentAmount.toString() ?? '0')
  }

  async function saveEdit() {
    if (!editName) return
    const expense = getExpense(editName)
    const budget = parseFloat(editBudget)
    const spent = parseFloat(editSpent)
    if (isNaN(budget) || isNaN(spent)) return

    if (expense) {
      await updateFixedExpense.mutateAsync({
        id: expense.id,
        data: { budgetAmount: budget, spentAmount: spent },
      })
    } else {
      await createFixedExpense.mutateAsync({
        name: editName,
        budgetAmount: budget,
        spentAmount: spent,
      })
    }
    setEditName(null)
  }

  async function handleReset() {
    if (!resetTarget) return
    const expense = getExpense(resetTarget)
    if (expense) {
      await resetFixedExpense.mutateAsync(expense.id)
    }
    setResetTarget(null)
  }

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Gastos Fijos</span>
      </div>

      <div className="space-y-3">
        {FIXED_EXPENSE_CATEGORIES.map(name => {
          const expense = getExpense(name)
          const budget = expense?.budgetAmount ?? 0
          const spent = expense?.spentAmount ?? 0
          const percent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0
          const isEditing = editName === name

          return (
            <div key={name} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-plus font-bold">{name}</h3>
                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(name)}
                      className="text-[10px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/80 transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setResetTarget(name)}
                      className="text-[10px] font-semibold uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[8px] font-semibold uppercase tracking-widest text-white/60 block mb-1">Budget</label>
                    <input
                      type="number" step="0.01"
                      value={editBudget}
                      onChange={e => setEditBudget(e.target.value)}
                      className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-semibold uppercase tracking-widest text-white/60 block mb-1">Spent</label>
                    <input
                      type="number" step="0.01"
                      value={editSpent}
                      onChange={e => setEditSpent(e.target.value)}
                      className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      disabled={updateFixedExpense.isPending || createFixedExpense.isPending}
                      className="flex-1 bg-white text-[#0B2415] text-xs font-plus font-bold py-2.5 rounded-xl hover:bg-white/95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditName(null)}
                      className="px-4 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] text-white/60 font-semibold uppercase tracking-widest block">Spent</span>
                      <span className="text-lg font-plus font-semibold text-white">${spent.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-white/60 font-semibold uppercase tracking-widest block">Budget</span>
                      <span className="text-lg font-plus font-semibold text-white/50">${budget.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full glass-dark rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-1000" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {resetTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setResetTarget(null)}
        >
          <div
            className="glass-dark rounded-[2rem] p-8 max-w-sm w-full mx-4 border border-white/10 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-plus font-bold mb-2">Reset {resetTarget}</h3>
            <p className="text-sm text-white/60 mb-6">
              Are you sure you want to reset the spent amount to $0.00?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={resetFixedExpense.isPending}
                className="flex-1 bg-red-500/80 text-white font-plus font-bold py-3 rounded-2xl hover:bg-red-500 transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                {resetFixedExpense.isPending ? 'Resetting...' : 'Yes, Reset'}
              </button>
              <button
                onClick={() => setResetTarget(null)}
                className="flex-1 bg-white/10 text-white/70 font-plus font-bold py-3 rounded-2xl hover:bg-white/20 transition-all text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
