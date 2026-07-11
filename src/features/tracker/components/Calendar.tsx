import { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { cn } from '@/lib/utils'

interface CalendarDay {
  date: Date
  hours?: number
  isCurrentMonth: boolean
}

interface Props {
  entryHours?: Record<string, number>
  selectedDate: string
  onDateSelect: (date: string) => void
}

export function Calendar({ entryHours = {}, selectedDate, onDateSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days: CalendarDay[] = eachDayOfInterval({ start: calStart, end: calEnd }).map(date => ({
    date,
    hours: entryHours[format(date, 'yyyy-MM-dd')],
    isCurrentMonth: isSameMonth(date, currentMonth),
  }))

  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  function prevMonth() { setCurrentMonth(m => subMonths(m, 1)) }
  function nextMonth() { setCurrentMonth(m => addMonths(m, 1)) }

  return (
    <section className="glass rounded-[2.5rem] p-8 lg:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-plus font-semibold tracking-tight">Activity Calendar</h3>
          <p className="text-sm text-white/60 font-inter font-medium tracking-wide mt-1">
            Visualization for {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3 glass-dark p-2 rounded-2xl border border-white/10">
          <button onClick={prevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors group cursor-pointer">
            <svg className="w-5 h-5 text-white group-active:scale-90 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="px-4 text-sm font-semibold uppercase tracking-widest">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors group cursor-pointer">
            <svg className="w-5 h-5 text-white group-active:scale-90 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 sm:gap-4">
        {dayHeaders.map(d => (
          <div key={d} className="text-center text-[10px] text-white/60 font-semibold uppercase tracking-widest py-2">
            {d}
          </div>
        ))}

        {days.map(day => {
          const hasHours = day.hours !== undefined
          const dateKey = format(day.date, 'yyyy-MM-dd')
          const isSelected = dateKey === selectedDate

          return (
            <div
              key={dateKey}
              onClick={() => onDateSelect(dateKey)}
              className={cn(
                'calendar-cell rounded-2xl font-plus font-semibold cursor-pointer transition-all hover:scale-110',
                !day.isCurrentMonth && 'opacity-10',
                isSelected && 'glass border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.2)] scale-110',
                !isSelected && isToday(day.date) && !hasHours && 'glass-dark border border-white/20',
                !isSelected && !isToday(day.date) && !hasHours && 'glass-dark',
                hasHours && !isSelected && 'glass border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
              )}
              role="button"
              tabIndex={0}
            >
              <span className={cn(
                'font-plus',
                hasHours && !isSelected ? 'font-extrabold text-xl' : 'font-semibold',
                !hasHours && !isSelected && 'text-white/60',
              )}>
                {format(day.date, 'd')}
              </span>
              {hasHours && (
                <span className="absolute bottom-2 text-[8px] font-inter font-semibold text-white/80">
                  {day.hours}h
                </span>
              )}
              {isToday(day.date) && !hasHours && !isSelected && (
                <div className="absolute bottom-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
