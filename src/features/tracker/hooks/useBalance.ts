import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/tracker.service'
import { config } from '@/lib/config'
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns'
import { useEffect } from 'react'

const balanceKey = ['balance'] as const

export function useBalance() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: balanceKey,
    queryFn: () => service.getBalance(),
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    const isFridayAfter6 = day === 5 && hour >= 18

    if (!isFridayAfter6 || !query.data) return

    const lastMonday = format(startOfWeek(subDays(now, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    if (query.data.lastProcessedWeek === lastMonday) return

    const fn = async () => {
      const lastWeekMon = startOfWeek(subDays(now, 7), { weekStartsOn: 1 })
      const lastWeekSun = endOfWeek(subDays(now, 7), { weekStartsOn: 1 })
      const entries = await service.getEntriesByDateRange(
        format(lastWeekMon, 'yyyy-MM-dd'),
        format(lastWeekSun, 'yyyy-MM-dd'),
      )
      const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
      const payout = totalHours * config.defaultHourlyRate

      await service.upsertBalance({
        total: (query.data?.total ?? 0) + payout,
        lastProcessedWeek: lastMonday,
      })

      queryClient.invalidateQueries({ queryKey: balanceKey })
    }

    fn()
  }, [query.data, queryClient])

  const updateMutation = useMutation({
    mutationFn: (total: number) => service.upsertBalance({ total }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: balanceKey }),
  })

  const isEditable = () => {
    const now = new Date()
    return now.getDay() === 5 && now.getHours() >= 18
  }

  return {
    balance: query.data ?? { total: 0, lastProcessedWeek: '' },
    isLoading: query.isLoading,
    updateTotal: updateMutation.mutateAsync,
    isEditable: isEditable(),
    isProcessing: updateMutation.isPending,
  }
}
