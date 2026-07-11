import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import type { Expense } from '../types'
import { EXPENSE_CATEGORIES } from '../types'
import { useCreateExpense } from '../hooks'

interface Props {
  expenses: Expense[]
  selectedDate: string
}

const expenseSchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().positive(),
  category: z.string().min(1),
})

type FormData = z.infer<typeof expenseSchema>

export function FinancialStream({ expenses, selectedDate }: Props) {
  const [showForm, setShowForm] = useState(false)
  const createExpense = useCreateExpense()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { category: EXPENSE_CATEGORIES[0] },
  })

  async function onSubmit(data: FormData) {
    try {
      await createExpense.mutateAsync({ ...data, date: selectedDate })
      reset()
      setShowForm(false)
    } catch {
      console.error('Failed to save expense')
    }
  }

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Expenses</span>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 && !showForm && (
          <p className="text-sm text-white/40 text-center py-4 font-inter">No expenses yet</p>
        )}

        {expenses.map(expense => (
          <div key={expense.id} className="flex items-center justify-between p-4 glass-dark rounded-2xl border border-white/5 hover:border-white/20 transition-all group cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold group-hover:text-white transition-colors">{expense.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-semibold uppercase tracking-widest glass-dark px-2 py-0.5 rounded-full border border-white/10 text-white/60">{expense.category}</span>
                  <span className="text-[9px] text-white/40">{expense.date ? format(parseISO(expense.date), 'MMM d') : ''}</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-white group-hover:scale-105 transition-transform">-${expense.amount.toFixed(2)}</span>
          </div>
        ))}

        {showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Name</label>
              <input className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" placeholder="e.g. Groceries" {...register('name')} />
              {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Amount</label>
              <div className="relative">
                <input type="number" step="0.01" placeholder="0.00" className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" {...register('amount')} />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 text-sm pointer-events-none">$</span>
              </div>
              {errors.amount && <p className="text-red-400 text-xs ml-1">{errors.amount.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Category</label>
              <select className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white [color-scheme:dark] appearance-none cursor-pointer" {...register('category')}>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B2415]">{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={createExpense.isPending} className="flex-1 bg-white text-[#0B2415] font-plus font-bold py-4 rounded-2xl hover:bg-white/95 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50">
                {createExpense.isPending ? 'Saving...' : 'Log Expense'}
              </button>
              <button type="button" onClick={() => { reset(); setShowForm(false) }} className="px-6 py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 cursor-pointer">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all border-t border-white/10 mt-2 cursor-pointer">+ Add Expense</button>
        )}
      </div>
    </section>
  )
}
