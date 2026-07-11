import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'font-plus font-bold rounded-2xl transition-all active:scale-[0.98] cursor-pointer',
        variant === 'primary' &&
          'w-full bg-white text-[#0B2415] py-5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/95',
        variant === 'ghost' &&
          'w-full py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-all',
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
