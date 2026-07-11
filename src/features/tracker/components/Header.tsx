import { User } from 'lucide-react'

interface Props {
  weeklyEarnings: number
  hourlyRate: number
}

export function Header({ weeklyEarnings, hourlyRate }: Props) {
  return (
    <header className="glass rounded-3xl p-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 glass-highlight">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div>
          <h1 className="font-plus font-extrabold text-2xl tracking-tighter">FastTrak</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
            <p className="text-xs text-white/50 font-inter uppercase tracking-widest font-semibold">Live Performance</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center glass-dark px-10 py-3 rounded-2xl border border-white/10">
        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-[0.2em] mb-1">Weekly Expected Total</span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl lg:text-5xl font-plus font-extrabold tracking-tighter">
            ${weeklyEarnings.toFixed(2)}
          </span>
          <span className="text-sm text-white/50 font-inter font-medium">(${hourlyRate.toFixed(2)}/hr)</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="w-12 h-12 rounded-full glass-dark flex items-center justify-center border border-white/10 hover:bg-white/20 card-hover-effect group cursor-pointer">
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <div className="flex items-center gap-4 glass-dark pl-2 pr-5 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all cursor-pointer card-hover-effect">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-white/80" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-semibold block leading-none mb-1">Carlos Flores</span>
            <span className="text-[10px] text-white/60 font-inter uppercase font-semibold">Premium Tier</span>
          </div>
        </div>
      </div>
    </header>
  )
}
