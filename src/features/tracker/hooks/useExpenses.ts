import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/tracker.service'
import type { CreateExpenseDTO } from '../types'

const expensesKey = ['expenses'] as const

export function useExpenses() {
  return useQuery({
    queryKey: expensesKey,
    queryFn: () => service.getRecentExpenses(),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExpenseDTO) => service.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKey })
    },
  })
}
