import { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { cn } from '@/lib/utils'

interface Props {
  selectedDate: string
  onDateSelect: (date: string) => void
}

export function MiniCalendar({ selectedDate, onDateSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calStart, end: calEnd }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentMonth),
  }))

  const dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  return (
    <div className="glass-dark rounded-2xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayHeaders.map(d => (
          <div key={d} className="text-center text-[8px] text-white/40 font-semibold uppercase tracking-widest py-1">
            {d}
          </div>
        ))}

        {days.map(day => {
          const dateKey = format(day.date, 'yyyy-MM-dd')
          const isSelected = dateKey === selectedDate

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onDateSelect(dateKey)}
              className={cn(
                'w-full aspect-square rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center',
                !day.isCurrentMonth && 'opacity-20 pointer-events-none',
                isSelected && 'glass border border-white/40 text-white scale-105',
                !isSelected && isToday(day.date) && 'border border-white/20 text-white/80',
                !isSelected && !isToday(day.date) && 'text-white/50 hover:bg-white/10 hover:text-white/80',
              )}
            >
              {format(day.date, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
