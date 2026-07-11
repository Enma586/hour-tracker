import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Milestone } from '../types'
import { MILESTONE_CATEGORIES } from '../types'
import { useAddFunds, useCreateMilestone } from '../hooks'
import { MiniCalendar } from './MiniCalendar'

interface Props {
  milestones: Milestone[]
  selectedDate: string
  onDateSelect: (date: string) => void
}

const goalSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  currentAmount: z.coerce.number().min(0),
  goalAmount: z.coerce.number().positive(),
})

type GoalForm = z.infer<typeof goalSchema>

export function MilestoneCard({ milestones, selectedDate, onDateSelect }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [useTargetDate, setUseTargetDate] = useState(false)
  const [fundInput, setFundInput] = useState('')

  const addFunds = useAddFunds()
  const createMilestone = useCreateMilestone()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: { category: MILESTONE_CATEGORIES[0] },
  })

  async function onGoalSubmit(data: GoalForm) {
    try {
      await createMilestone.mutateAsync({
        name: data.name,
        category: data.category,
        currentAmount: data.currentAmount,
        goalAmount: data.goalAmount,
        targetDate: useTargetDate ? selectedDate : undefined,
      })
      reset()
      setShowForm(false)
      setUseTargetDate(false)
    } catch {
      console.error('Failed to save milestone')
    }
  }

  const milestone = milestones[0]
  const percent = milestone ? Math.min(Math.round((milestone.currentAmount / milestone.goalAmount) * 100), 100) : 0
  const remaining = milestone ? milestone.goalAmount - milestone.currentAmount : 0

  async function handleAddFunds() {
    const amount = parseFloat(fundInput)
    if (isNaN(amount) || amount <= 0) return
    await addFunds.mutateAsync({ milestoneId: milestone!.id, amount })
    setFundInput('')
  }

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Goal</span>
      </div>

      {milestone && (
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-plus font-extrabold tracking-tighter">{milestone.name}</h3>
              <span className="inline-block text-[8px] font-semibold uppercase tracking-widest glass-dark px-2 py-0.5 rounded-full border border-white/10 text-white/60">{milestone.category}</span>
            </div>
          </div>

          {milestone.targetDate && (
            <div className="flex items-center gap-2 text-[10px] text-white/50 font-semibold uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>
                {format(parseISO(milestone.targetDate), 'MMM d, yyyy')}
                {differenceInDays(parseISO(milestone.targetDate), new Date()) >= 0 && (
                  <span className="ml-2">({differenceInDays(parseISO(milestone.targetDate), new Date())}d left)</span>
                )}
              </span>
            </div>
          )}

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] text-white/60 font-semibold uppercase tracking-widest block">Current</span>
              <span className="text-2xl font-plus font-semibold text-white">${milestone.currentAmount.toFixed(2)}</span>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] text-white/60 font-semibold uppercase tracking-widest block">Goal</span>
              <span className="text-2xl font-plus font-semibold text-white/50">${milestone.goalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full glass-dark rounded-full overflow-hidden border border-white/10 p-1 flex">
              <div className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-semibold uppercase tracking-widest text-white/50">
              <span>{percent}% Secured</span>
              <span>${remaining.toFixed(2)} Remaining</span>
            </div>
          </div>

          {percent < 100 && (
            <div className="space-y-3 pt-2">
              <div className="relative">
                <input
                  type="number" step="0.01" min="0.01" placeholder="Add funds"
                  value={fundInput}
                  onChange={e => setFundInput(e.target.value)}
                  className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all placeholder:text-white/40 text-white"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 text-sm pointer-events-none">$</span>
              </div>
              <button
                onClick={handleAddFunds}
                disabled={addFunds.isPending}
                className="w-full bg-white text-[#0B2415] font-plus font-bold py-4 rounded-2xl hover:bg-white/95 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                {addFunds.isPending ? '...' : 'Add Funds'}
              </button>
            </div>
          )}
        </div>
      )}

      {!milestone && !showForm && (
        <div className="space-y-3">
          <p className="text-sm text-white/40 text-center py-4 font-inter">No goals yet</p>
        </div>
      )}

      {showForm && (
        <div className={milestone ? 'pt-6 mt-4 border-t border-white/10' : ''}>
          <form onSubmit={handleSubmit(onGoalSubmit)} className="space-y-4">
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Name</label>
              <input className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" placeholder="e.g. PlayStation 5" {...register('name')} />
              {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Category</label>
              <select className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white [color-scheme:dark] appearance-none cursor-pointer" {...register('category')}>
                {MILESTONE_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B2415]">{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Current $</label>
                <input type="number" step="0.01" placeholder="0.00" className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" {...register('currentAmount')} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Target $</label>
                <input type="number" step="0.01" placeholder="0.00" className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" {...register('goalAmount')} />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setUseTargetDate(v => !v)} className={cn('w-10 h-6 rounded-full transition-colors relative flex-shrink-0 border border-white/10', useTargetDate ? 'bg-white/30' : 'bg-white/5')}>
                <div className={cn('w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow', useTargetDate ? 'left-5' : 'left-1')} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">Target date</span>
            </label>
            {useTargetDate && <MiniCalendar selectedDate={selectedDate} onDateSelect={onDateSelect} />}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={createMilestone.isPending} className="flex-1 bg-white text-[#0B2415] font-plus font-bold py-4 rounded-2xl hover:bg-white/95 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50">
                {createMilestone.isPending ? 'Saving...' : 'Set Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && !milestone && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all border-t border-white/10 mt-2 cursor-pointer"
        >
          + Set Goal
        </button>
      )}

      {!showForm && milestone && (
        <button
          onClick={() => { setShowForm(true); reset() }}
          className="w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all border-t border-white/10 mt-2 cursor-pointer"
        >
          + New Goal
        </button>
      )}

      {showForm && (
        <button
          onClick={() => setShowForm(false)}
          className="w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all border-t border-white/10 mt-2 cursor-pointer"
        >
          Cancel
        </button>
      )}
    </section>
  )
}
