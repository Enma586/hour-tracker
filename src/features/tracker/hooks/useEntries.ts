import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/tracker.service'
import type { CreateTimeEntryDTO } from '../types'
import { config } from '@/lib/config'
import { startOfWeek, endOfWeek, format } from 'date-fns'

const entriesKey = ['entries'] as const

export function useRecentEntries() {
  return useQuery({
    queryKey: entriesKey,
    queryFn: () => service.getRecentEntries(),
  })
}

export function useWeeklyEntries() {
  const today = new Date()
  const start = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const end = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')

  return useQuery({
    queryKey: [...entriesKey, 'weekly', start, end],
    queryFn: () => service.getEntriesByDateRange(start, end),
  })
}

export function useCreateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimeEntryDTO) => service.upsertEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entriesKey })
    },
  })
}

export function useWeeklyStats() {
  const { data: entries = [], isLoading } = useWeeklyEntries()

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
  const hourlyRate = config.defaultHourlyRate
  const earned = totalHours * hourlyRate
  const growthPercentage = 12.5

  const weeklyGoalHours = 30
  const weeklyGoalPercent = Math.min(Math.round((totalHours / weeklyGoalHours) * 100), 100)

  return {
    data: { totalHours, totalEarnings: earned, growthPercentage, weeklyGoalPercent },
    isLoading,
  }
}
