import type { Timestamp } from 'firebase/firestore'

export interface TimeEntry {
  id: string
  hours: number
  description: string
  date: string
  hourlyRate: number
  createdAt: Timestamp
}

export interface CreateTimeEntryDTO {
  hours: number
  description: string
  date: string
  hourlyRate: number
}

export interface Expense {
  id: string
  name: string
  amount: number
  category: string
  date: string
  createdAt: Timestamp
}

export interface CreateExpenseDTO {
  name: string
  amount: number
  category: string
  date: string
}

export interface Milestone {
  id: string
  name: string
  category: string
  currentAmount: number
  goalAmount: number
  targetDate?: string
  createdAt: Timestamp
}

export interface CreateMilestoneDTO {
  name: string
  category: string
  currentAmount: number
  goalAmount: number
  targetDate?: string
}

export interface AddFundsDTO {
  milestoneId: string
  amount: number
}

export interface Balance {
  total: number
  lastProcessedWeek: string
}

export const MILESTONE_CATEGORIES = [
  'Savings',
  'Technology',
  'Travel',
  'Health',
  'Personal',
  'Other',
] as const

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Other',
] as const

export interface WeeklyStats {
  totalHours: number
  totalEarnings: number
  growthPercentage: number
  weeklyGoalPercent: number
}

export type TabType = 'hours' | 'goal'
