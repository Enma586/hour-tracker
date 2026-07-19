import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/tracker.service'
import { config } from '@/lib/config'
import { startOfWeek, subDays, format } from 'date-fns'
import { useEffect } from 'react'

const balanceKey = ['balance'] as const

function getLastPayoutFriday(): Date {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  if (day === 5 && hour >= 18) return now
  const daysToSubtract = day === 5 ? 7 : ((day + 2) % 7) || 7
  return subDays(now, daysToSubtract)
}

export function useBalance() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: balanceKey,
    queryFn: () => service.getBalance(),
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    if (!query.data) return

    if (!query.data.reconciled) {
      service.reconcileBalance().then(() =>
        queryClient.invalidateQueries({ queryKey: balanceKey })
      )
      return
    }

    const payoutFriday = getLastPayoutFriday()
    const paidSunday = subDays(payoutFriday, 5)
    const paidMonday = startOfWeek(paidSunday, { weekStartsOn: 1 })
    const periodKey = format(paidMonday, 'yyyy-MM-dd')

    if (query.data.lastProcessedWeek === periodKey) return

    const fn = async () => {
      const entries = await service.getEntriesByDateRange(
        format(paidMonday, 'yyyy-MM-dd'),
        format(paidSunday, 'yyyy-MM-dd'),
      )
      const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
      const payout = totalHours * config.defaultHourlyRate

      await service.upsertBalance({
        total: (query.data?.total ?? 0) + payout,
        lastProcessedWeek: periodKey,
      })

      queryClient.invalidateQueries({ queryKey: balanceKey })
    }

    fn()
  }, [query.data, queryClient])

  const updateMutation = useMutation({
    mutationFn: (total: number) => service.upsertBalance({ total }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: balanceKey }),
  })

  const updateEmergencyFundMutation = useMutation({
    mutationFn: (emergencyFund: number) => service.upsertBalance({ emergencyFund }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: balanceKey }),
  })

  const isEditable = () => {
    const now = new Date()
    return now.getDay() === 5 && now.getHours() >= 18
  }

  return {
    balance: query.data ?? { total: 0, emergencyFund: 0, lastProcessedWeek: '', reconciled: false },
    isLoading: query.isLoading,
    updateTotal: updateMutation.mutateAsync,
    updateEmergencyFund: updateEmergencyFundMutation.mutateAsync,
    isEditable: isEditable(),
    isProcessing: updateMutation.isPending || updateEmergencyFundMutation.isPending,
  }
}
