interface Props {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg className="w-12 h-12 text-white/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-white/60 text-sm font-inter">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
