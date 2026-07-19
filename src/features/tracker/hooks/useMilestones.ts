import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/tracker.service'
import type { CreateMilestoneDTO, AddFundsDTO } from '../types'

const milestonesKey = ['milestones'] as const

export function useMilestones() {
  return useQuery({
    queryKey: milestonesKey,
    queryFn: () => service.getMilestones(),
  })
}

export function useCreateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMilestoneDTO) => service.createMilestone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { currentAmount?: number; goalAmount?: number } }) =>
      service.updateMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useAddFunds() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddFundsDTO) => service.addFundsToMilestone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesKey })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}
