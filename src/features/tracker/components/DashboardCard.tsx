interface Props {
  totalHours: number
  weeklyGoalPercent: number
}

export function DashboardCard({ totalHours, weeklyGoalPercent }: Props) {
  const circumference = 440
  const dashOffset = circumference - (circumference * weeklyGoalPercent) / 100

  return (
    <section className="glass rounded-[2.5rem] p-8 lg:p-12 glass-highlight flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="space-y-10 w-full md:w-auto">
        <div className="space-y-1">
          <h3 className="text-white/60 text-[10px] font-semibold uppercase tracking-widest ml-1">
            Weekly Logged Performance
          </h3>
          <div className="flex items-baseline gap-4">
            <span className="text-8xl font-plus font-black tracking-tighter">
              {totalHours.toFixed(1)}
            </span>
            <span className="text-2xl font-plus font-semibold text-white/50 lowercase">Hours</span>
          </div>
        </div>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" className="fill-none stroke-white/5" strokeWidth="12" />
          <circle
            cx="80" cy="80" r="70"
            className="fill-none stroke-white"
            strokeWidth="12"
            strokeDasharray="440"
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <svg className="w-10 h-10 mb-2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-plus font-extrabold tracking-tighter">
              {weeklyGoalPercent}
            </span>
            <span className="text-xl font-plus font-semibold text-white/50">%</span>
          </div>
          <span className="text-[10px] text-white/60 uppercase font-semibold tracking-widest mt-1">Weekly Goal 30h</span>
        </div>
      </div>
    </section>
  )
}
