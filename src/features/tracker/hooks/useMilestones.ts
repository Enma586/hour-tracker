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
    },
  })
}

export function useAddFunds() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddFundsDTO) => service.addFundsToMilestone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesKey })
    },
  })
}
