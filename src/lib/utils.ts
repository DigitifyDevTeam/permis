import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { User, UserStatus } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

export function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

export function daysLeft(subscriptionEndsAt: string | null): number | null {
  if (!subscriptionEndsAt) return null
  const ms = new Date(subscriptionEndsAt).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

/** Past end date → account must be suspended (not deleted). */
export function shouldBeSuspended(user: User): boolean {
  if (user.role !== 'LEARNER') return false
  if (user.status === 'BLOCKED') return false
  if (!user.subscriptionEndsAt) return user.status === 'SUSPENDED'
  return new Date(user.subscriptionEndsAt).getTime() <= Date.now()
}

export function resolveLearnerStatus(user: User): UserStatus {
  if (user.role !== 'LEARNER') return user.status
  if (user.status === 'BLOCKED') return 'BLOCKED'
  if (shouldBeSuspended(user)) return 'SUSPENDED'
  return 'ACTIVE'
}

export function applySuspensionRules(users: User[]): User[] {
  return users.map((user) => {
    if (user.role !== 'LEARNER' || user.status === 'BLOCKED') return user
    const next = resolveLearnerStatus(user)
    return next === user.status ? user : { ...user, status: next }
  })
}

export function isAccountActive(user: User | null | undefined): boolean {
  if (!user || user.role !== 'LEARNER') return false
  return resolveLearnerStatus(user) === 'ACTIVE'
}

export function isAccountSuspended(user: User | null | undefined): boolean {
  if (!user || user.role !== 'LEARNER') return false
  return resolveLearnerStatus(user) === 'SUSPENDED'
}

/** Active only: courses, exercises, new mock exams */
export function canAccessLearning(user: User | null | undefined): boolean {
  return isAccountActive(user)
}

/** Active or suspended: previous exams archive */
export function canViewArchive(user: User | null | undefined): boolean {
  if (!user || user.role !== 'LEARNER') return false
  if (user.status === 'BLOCKED') return false
  const status = resolveLearnerStatus(user)
  return status === 'ACTIVE' || status === 'SUSPENDED'
}

/** Active or suspended: profile view */
export function canViewProfile(user: User | null | undefined): boolean {
  return canViewArchive(user)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ar-TN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso))
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function arraysEqualAsSet(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every((x) => set.has(x))
}
