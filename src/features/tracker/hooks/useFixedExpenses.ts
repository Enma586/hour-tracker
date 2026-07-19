import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/tracker.service'
import type { CreateFixedExpenseDTO, UpdateFixedExpenseDTO } from '../types'

const fixedExpensesKey = ['fixedExpenses'] as const

export function useFixedExpenses() {
  return useQuery({
    queryKey: fixedExpensesKey,
    queryFn: () => service.getFixedExpenses(),
  })
}

export function useCreateFixedExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFixedExpenseDTO) => service.createFixedExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedExpensesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useUpdateFixedExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFixedExpenseDTO }) =>
      service.updateFixedExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedExpensesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useResetFixedExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => service.resetFixedExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedExpensesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}
