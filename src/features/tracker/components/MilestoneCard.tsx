import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Milestone } from '../types'
import { MILESTONE_CATEGORIES } from '../types'
import { useAddFunds, useCreateMilestone, useUpdateMilestone } from '../hooks'
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

function GoalItem({ milestone, onFundsAdded }: { milestone: Milestone; onFundsAdded: () => void }) {
  const addFunds = useAddFunds()
  const updateMilestone = useUpdateMilestone()
  const [fundInput, setFundInput] = useState('')
  const [external, setExternal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editCurrent, setEditCurrent] = useState('')
  const [editGoal, setEditGoal] = useState('')

  const percent = Math.min(Math.round((milestone.currentAmount / milestone.goalAmount) * 100), 100)
  const remaining = milestone.goalAmount - milestone.currentAmount

  async function handleAddFunds() {
    const amount = parseFloat(fundInput)
    if (isNaN(amount) || amount <= 0) return
    await addFunds.mutateAsync({ milestoneId: milestone.id, amount, external })
    setFundInput('')
    onFundsAdded()
  }

  async function handleSaveEdit() {
    const cur = parseFloat(editCurrent)
    const goal = parseFloat(editGoal)
    if (isNaN(cur) || cur < 0 || isNaN(goal) || goal <= 0) return
    await updateMilestone.mutateAsync({ id: milestone.id, data: { currentAmount: cur, goalAmount: goal } })
    setEditing(false)
  }

  const [showFunds, setShowFunds] = useState(false)

  return (
    <div className="space-y-3 pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow border border-white/20 flex-shrink-0">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-plus font-bold tracking-tight truncate">{milestone.name}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[8px] font-semibold uppercase tracking-widest glass-dark px-2 py-0.5 rounded-full border border-white/10 text-white/60">{milestone.category}</span>
              {!editing && (
                <button onClick={() => { setEditCurrent(milestone.currentAmount.toString()); setEditGoal(milestone.goalAmount.toString()); setEditing(true) }} className="text-[8px] text-white/40 hover:text-white/70 uppercase tracking-widest font-semibold cursor-pointer">Edit</button>
              )}
            </div>
          </div>
          {milestone.targetDate && (
            <p className="text-[9px] text-white/40 font-inter">
              Target {format(parseISO(milestone.targetDate), 'MMM d, yyyy')}
              {differenceInDays(parseISO(milestone.targetDate), new Date()) >= 0 && (
                <> ({differenceInDays(parseISO(milestone.targetDate), new Date())}d left)</>
              )}
            </p>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-semibold uppercase tracking-widest text-white/60 block mb-1">Current $</label>
              <input type="number" step="0.01" value={editCurrent} onChange={e => setEditCurrent(e.target.value)} className="w-full bg-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" />
            </div>
            <div>
              <label className="text-[8px] font-semibold uppercase tracking-widest text-white/60 block mb-1">Target $</label>
              <input type="number" step="0.01" value={editGoal} onChange={e => setEditGoal(e.target.value)} className="w-full bg-white/5 rounded-xl px-3 py-2 text-sm focus:outline-none border border-white/10 focus:border-white/30 transition-all text-white" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSaveEdit} disabled={updateMilestone.isPending} className="flex-1 bg-white text-[#0B2415] text-xs font-plus font-bold py-2.5 rounded-xl hover:bg-white/95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50">Save</button>
            <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end">
            <span className="text-base font-plus font-semibold text-white">${milestone.currentAmount.toFixed(2)}</span>
            <div className="text-right">
              <span className="text-[9px] text-white/60 font-semibold uppercase tracking-widest">of ${milestone.goalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="h-3 w-full glass-dark rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
          </div>
          <div className="flex justify-between text-[8px] font-semibold uppercase tracking-widest text-white/40">
            <span>{percent}%</span>
            <span>${remaining.toFixed(2)} left</span>
          </div>
        </>
      )}

      {percent < 100 && (
        <div>
          <button
            onClick={() => setShowFunds(v => !v)}
            className="w-full py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-all cursor-pointer"
          >
            {showFunds ? 'Cancel' : '+ Add Funds'}
          </button>
          {showFunds && (
            <div className="space-y-3 pt-2">
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <input
                    type="number" step="0.01" min="0.01" placeholder="Amount"
                    value={fundInput}
                    onChange={e => setFundInput(e.target.value)}
                    className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all placeholder:text-white/40 text-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-xs pointer-events-none">$</span>
                </div>
                <button
                  onClick={handleAddFunds}
                  disabled={addFunds.isPending}
                  className="bg-white text-[#0B2415] font-plus font-bold px-5 py-3 rounded-xl hover:bg-white/95 active:scale-[0.98] transition-all text-xs cursor-pointer disabled:opacity-50"
                >
                  {addFunds.isPending ? '...' : 'Add'}
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <div
                  onClick={() => setExternal(v => !v)}
                  className={cn('w-8 h-5 rounded-full transition-colors relative flex-shrink-0 border border-white/10', external ? 'bg-white/30' : 'bg-white/5')}
                >
                  <div className={cn('w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow', external ? 'left-4' : 'left-1')} />
                </div>
                <span className="text-[8px] font-semibold uppercase tracking-widest text-white/40">External (no discount)</span>
              </label>
            </div>
          )}
        </div>
      )}

      {percent >= 100 && (
        <p className="text-[9px] text-green-400/70 font-semibold uppercase tracking-widest text-center">Completed</p>
      )}
    </div>
  )
}

export function MilestoneCard({ milestones, selectedDate, onDateSelect }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [useTargetDate, setUseTargetDate] = useState(false)

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

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Goals ({milestones.length})</span>
      </div>

      {milestones.length === 0 && !showForm && (
        <p className="text-sm text-white/40 text-center py-4 font-inter">No goals yet</p>
      )}

      {milestones.length > 0 && (
        <div className="space-y-4">
          {milestones.map(m => (
            <GoalItem key={m.id} milestone={m} onFundsAdded={() => {}} />
          ))}
        </div>
      )}

      {showForm && (
        <div className={milestones.length > 0 ? 'pt-6 mt-4 border-t border-white/10' : ''}>
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

      {!showForm && (
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
