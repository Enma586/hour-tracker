interface Props {
  message?: string
}

export function EmptyState({ message = 'No data yet' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg className="w-12 h-12 text-white/20 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
      <p className="text-white/40 text-sm font-inter">{message}</p>
    </div>
  )
}
