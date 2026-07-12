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
import type { TimeEntry, CreateTimeEntryDTO, Expense, CreateExpenseDTO, Milestone, CreateMilestoneDTO, AddFundsDTO, Balance } from '../types'

const entriesRef = collection(db, 'entries')
const expensesRef = collection(db, 'expenses')
const milestonesRef = collection(db, 'milestones')

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

export async function createMilestone(data: CreateMilestoneDTO): Promise<string> {
  const docRef = await addDoc(milestonesRef, {
    name: data.name,
    category: data.category,
    currentAmount: data.currentAmount,
    goalAmount: data.goalAmount,
    targetDate: data.targetDate ?? null,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getMilestones(): Promise<Milestone[]> {
  const q = query(milestonesRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Milestone))
}

export async function addFundsToMilestone({ milestoneId, amount }: AddFundsDTO): Promise<void> {
  const ref = doc(db, 'milestones', milestoneId)
  const snap = await getDoc(ref)
  const current = snap.data() as Milestone | undefined
  if (!current) throw new Error('Milestone not found')
  await updateDoc(ref, {
    currentAmount: current.currentAmount + amount,
  })
  const balance = await getBalance()
  await upsertBalance({ total: (balance.total ?? 0) - amount })
}

const balanceRef = doc(db, 'balance', 'main')

export async function getBalance(): Promise<Balance> {
  const snap = await getDoc(balanceRef)
  return snap.exists() ? snap.data() as Balance : { total: 0, lastProcessedWeek: '' }
}

export async function upsertBalance(data: Partial<Balance>): Promise<void> {
  await setDoc(balanceRef, data, { merge: true })
}
