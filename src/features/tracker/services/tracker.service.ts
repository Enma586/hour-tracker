import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { TimeEntry, CreateTimeEntryDTO, Expense, CreateExpenseDTO, Milestone, CreateMilestoneDTO, AddFundsDTO, Balance, FixedExpense, CreateFixedExpenseDTO, UpdateFixedExpenseDTO } from '../types'

const entriesRef = collection(db, 'entries')
const expensesRef = collection(db, 'expenses')
const milestonesRef = collection(db, 'milestones')
const fixedExpensesRef = collection(db, 'fixedExpenses')

export async function upsertEntry(data: CreateTimeEntryDTO): Promise<string> {
  const q = query(entriesRef, where('date', '==', data.date))
  const snap = await getDocs(q)
  const deletes = snap.docs.map(d => deleteDoc(doc(db, 'entries', d.id)))
  await Promise.all(deletes)

  const ref = doc(db, 'entries', data.date)
  await setDoc(ref, { ...data, createdAt: new Date() })
  return data.date
}

export async function getRecentEntries(limitCount = 50): Promise<TimeEntry[]> {
  const q = query(entriesRef, orderBy('date', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeEntry))
}

export async function getEntriesByDateRange(start: string, end: string): Promise<TimeEntry[]> {
  const q = query(entriesRef, where('date', '>=', start), where('date', '<=', end), orderBy('date', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeEntry))
}

export async function createExpense(data: CreateExpenseDTO): Promise<string> {
  const docRef = await addDoc(expensesRef, {
    name: data.name,
    amount: data.amount,
    category: data.category,
    date: data.date,
    createdAt: new Date(),
  })
  const balance = await getBalance()
  await upsertBalance({ total: (balance.total ?? 0) - data.amount })
  return docRef.id
}

export async function getRecentExpenses(limitCount = 10): Promise<Expense[]> {
  const q = query(expensesRef, orderBy('date', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense))
}

export async function deleteExpense(id: string, amount: number): Promise<void> {
  await deleteDoc(doc(db, 'expenses', id))
  const balance = await getBalance()
  await upsertBalance({ total: (balance.total ?? 0) + amount })
}

export async function createMilestone(data: CreateMilestoneDTO): Promise<string> {
  const docRef = await addDoc(milestonesRef, {
    name: data.name,
    category: data.category,
    currentAmount: data.currentAmount,
    goalAmount: data.goalAmount,
    targetDate: data.targetDate ?? null,
    createdAt: new Date(),
  })
  const balance = await getBalance()
  await upsertBalance({ total: (balance.total ?? 0) - data.currentAmount })
  return docRef.id
}

export async function getMilestones(): Promise<Milestone[]> {
  const q = query(milestonesRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Milestone))
}

export async function updateMilestone(id: string, data: { currentAmount?: number; goalAmount?: number }): Promise<void> {
  const ref = doc(db, 'milestones', id)
  const snap = await getDoc(ref)
  const current = snap.data() as Milestone | undefined
  if (!current) throw new Error('Milestone not found')
  const fields: Record<string, number> = {}
  if (data.currentAmount !== undefined) fields.currentAmount = data.currentAmount
  if (data.goalAmount !== undefined) fields.goalAmount = data.goalAmount
  await updateDoc(ref, fields)
  if (data.currentAmount !== undefined) {
    const diff = data.currentAmount - current.currentAmount
    if (diff > 0) {
      const balance = await getBalance()
      await upsertBalance({ total: (balance.total ?? 0) - diff })
    } else if (diff < 0) {
      const balance = await getBalance()
      await upsertBalance({ total: (balance.total ?? 0) + Math.abs(diff) })
    }
  }
}

export async function addFundsToMilestone({ milestoneId, amount, external }: AddFundsDTO): Promise<void> {
  const ref = doc(db, 'milestones', milestoneId)
  const snap = await getDoc(ref)
  const current = snap.data() as Milestone | undefined
  if (!current) throw new Error('Milestone not found')
  await updateDoc(ref, {
    currentAmount: current.currentAmount + amount,
  })
  if (!external) {
    const balance = await getBalance()
    await upsertBalance({ total: (balance.total ?? 0) - amount })
  }
}

export async function getFixedExpenses(): Promise<FixedExpense[]> {
  const q = query(fixedExpensesRef, orderBy('createdAt', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FixedExpense))
}

export async function createFixedExpense(data: CreateFixedExpenseDTO): Promise<string> {
  const docRef = await addDoc(fixedExpensesRef, {
    name: data.name,
    budgetAmount: data.budgetAmount,
    spentAmount: data.spentAmount,
    createdAt: new Date(),
  })
  if (data.spentAmount > 0) {
    const balance = await getBalance()
    await upsertBalance({ total: (balance.total ?? 0) - data.spentAmount })
  }
  return docRef.id
}

export async function updateFixedExpense(id: string, data: UpdateFixedExpenseDTO): Promise<void> {
  const ref = doc(db, 'fixedExpenses', id)
  const snap = await getDoc(ref)
  const currentData = snap.data()
  const currentSpent = currentData?.spentAmount ?? 0
  const fields: Record<string, number> = {}
  if (data.budgetAmount !== undefined) fields.budgetAmount = data.budgetAmount
  if (data.spentAmount !== undefined) fields.spentAmount = data.spentAmount
  await updateDoc(ref, fields)

  if (data.spentAmount !== undefined) {
    const diff = data.spentAmount - currentSpent
    if (diff > 0) {
      const balance = await getBalance()
      await upsertBalance({ total: (balance.total ?? 0) - diff })
    }
  }
}

export async function resetFixedExpense(id: string): Promise<void> {
  const ref = doc(db, 'fixedExpenses', id)
  const snap = await getDoc(ref)
  const currentSpent = (snap.data()?.spentAmount as number) ?? 0
  await updateDoc(ref, { spentAmount: 0 })
  if (currentSpent > 0) {
    const balance = await getBalance()
    await upsertBalance({ total: (balance.total ?? 0) + currentSpent })
  }
}

const balanceRef = doc(db, 'balance', 'main')

export async function getBalance(): Promise<Balance> {
  const snap = await getDoc(balanceRef)
  if (!snap.exists()) return { total: 0, emergencyFund: 0, lastProcessedWeek: '', reconciled: false }
  const data = snap.data()
  return {
    total: data.total ?? 0,
    emergencyFund: data.emergencyFund ?? 0,
    lastProcessedWeek: data.lastProcessedWeek ?? '',
    reconciled: data.reconciled ?? false,
  }
}

export async function upsertBalance(data: Partial<Balance>): Promise<void> {
  const existing = await getBalance()
  await setDoc(balanceRef, {
    total: existing.total,
    emergencyFund: existing.emergencyFund,
    lastProcessedWeek: existing.lastProcessedWeek,
    reconciled: existing.reconciled,
    ...data,
  })
}

export async function reconcileBalance(): Promise<void> {
  const balance = await getBalance()
  if (balance.reconciled) return

  const milestoneSnap = await getDocs(milestonesRef)
  const milestonesTotal = milestoneSnap.docs.reduce((sum, d) => sum + ((d.data().currentAmount as number) ?? 0), 0)

  const fixedSnap = await getDocs(fixedExpensesRef)
  const fixedTotal = fixedSnap.docs.reduce((sum, d) => sum + ((d.data().spentAmount as number) ?? 0), 0)

  await setDoc(balanceRef, {
    total: balance.total - milestonesTotal - fixedTotal,
    emergencyFund: balance.emergencyFund,
    lastProcessedWeek: balance.lastProcessedWeek,
    reconciled: true,
  })
}
