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
  external?: boolean
}

export interface Balance {
  total: number
  emergencyFund: number
  lastProcessedWeek: string
  reconciled: boolean
}

export interface FixedExpense {
  id: string
  name: string
  budgetAmount: number
  spentAmount: number
  createdAt: Timestamp
}

export interface CreateFixedExpenseDTO {
  name: string
  budgetAmount: number
  spentAmount: number
}

export interface UpdateFixedExpenseDTO {
  budgetAmount?: number
  spentAmount?: number
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
  'Technology'
] as const

export const FIXED_EXPENSE_CATEGORIES = [
  'Suscripciones',
  'Alimentos',
  'Diezmo',
] as const

export interface WeeklyStats {
  totalHours: number
  totalEarnings: number
  growthPercentage: number
  weeklyGoalPercent: number
}

export type TabType = 'hours' | 'goal'
