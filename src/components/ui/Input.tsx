import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  suffix?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, suffix, id, ...props }, ref) => (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 ml-1 block"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-white/5 hover:bg-white/10 rounded-2xl px-6 py-5 text-4xl font-plus font-semibold',
            'focus:outline-none border border-white/10 focus:border-white/30 transition-all',
            'placeholder:text-white/40 text-white',
            suffix && 'pr-20',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 font-plus font-semibold text-xl uppercase tracking-widest pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  ),
)

Input.displayName = 'Input'

export const InputText = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-white/5 hover:bg-white/10 rounded-2xl px-6 py-4 text-sm font-medium',
        'focus:outline-none border border-white/10 focus:border-white/30 transition-all',
        'placeholder:text-white/40 text-white',
        className,
      )}
      {...props}
    />
  ),
)

InputText.displayName = 'InputText'
