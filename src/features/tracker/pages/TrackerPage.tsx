import { useState } from 'react'
import { useWeeklyStats, useExpenses, useMilestones, useRecentEntries, useFixedExpenses } from '../hooks'
import { Header } from '../components/Header'
import { DashboardCard } from '../components/DashboardCard'
import { Calendar } from '../components/Calendar'
import { TotalBalanceCard } from '../components/TotalBalanceCard'
import { MilestoneCard } from '../components/MilestoneCard'
import { FixedExpenseCard } from '../components/FixedExpenseCard'
import { EmergencyFundCard } from '../components/EmergencyFundCard'
import { FinancialStream } from '../components/FinancialStream'
import { QuickActions } from '../components/QuickActions'
import { config } from '@/lib/config'
import { format, parseISO } from 'date-fns'

export default function TrackerPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data: stats } = useWeeklyStats()
  const { data: expenses = [] } = useExpenses()
  const { data: milestones = [] } = useMilestones()
  const { data: fixedExpenses = [] } = useFixedExpenses()
  const { data: entries = [] } = useRecentEntries()

  const entryHours: Record<string, number> = {}
  for (const entry of entries) {
    const key = entry.date?.includes('T')
      ? format(parseISO(entry.date), 'yyyy-MM-dd')
      : entry.date
    entryHours[key] = (entryHours[key] ?? 0) + entry.hours
  }

  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <img
          src="/space-bg.webp"
          alt="Deep Space Background"
          className="w-full h-full object-cover"
          decoding="async"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-8 min-h-screen">
        <Header
          weeklyEarnings={stats?.totalEarnings ?? 0}
          hourlyRate={config.defaultHourlyRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <DashboardCard
              totalHours={stats?.totalHours ?? 0}
              weeklyGoalPercent={stats?.weeklyGoalPercent ?? 0}
            />

            <Calendar entryHours={entryHours} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <TotalBalanceCard />
            <EmergencyFundCard />
            <FixedExpenseCard fixedExpenses={fixedExpenses} />
            <MilestoneCard milestones={milestones} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            <FinancialStream expenses={expenses} selectedDate={selectedDate} />
            <QuickActions selectedDate={selectedDate} />
          </div>
        </div>
      </main>
    </>
  )
}
