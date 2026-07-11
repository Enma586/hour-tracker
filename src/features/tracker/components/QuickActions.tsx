import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { config } from '@/lib/config'
import { useCreateEntry } from '../hooks/useEntries'

interface Props {
  selectedDate: string
}

const hoursSchema = z.object({
  hours: z.coerce.number().positive('Must be greater than 0'),
})

type HoursForm = z.infer<typeof hoursSchema>

export function QuickActions({ selectedDate }: Props) {
  const createEntry = useCreateEntry()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HoursForm>({ resolver: zodResolver(hoursSchema) })

  async function onSubmit(data: HoursForm) {
    try {
      await createEntry.mutateAsync({
        hours: data.hours,
        description: '',
        date: selectedDate,
        hourlyRate: config.defaultHourlyRate,
      })
      reset()
    } catch {
      console.error('Failed to save entry')
    }
  }

  return (
    <section className="glass-dark rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex items-center gap-2 text-white/50 mb-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-widest">Log Hours</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          <label htmlFor="hours" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block">Hours Session</label>
          <div className="relative">
            <input
              id="hours"
              type="number" step="0.1" placeholder="0.0"
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none border border-white/10 focus:border-white/30 transition-all placeholder:text-white/40 text-white"
              {...register('hours')}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 font-plus font-semibold text-xl uppercase tracking-widest pointer-events-none">Hrs</span>
          </div>
          {errors.hours && <p className="text-red-400 text-xs ml-1">{errors.hours.message}</p>}
        </div>

        <button
          type="submit"
          disabled={createEntry.isPending}
          className="w-full bg-white text-[#0B2415] font-plus font-bold py-4 rounded-2xl hover:bg-white/95 active:scale-[0.98] transition-all text-sm cursor-pointer disabled:opacity-50"
        >
          {createEntry.isPending ? 'Saving...' : 'Commit Entry'}
        </button>
      </form>
    </section>
  )
}
