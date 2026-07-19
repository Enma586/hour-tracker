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
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => service.deleteExpense(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}
