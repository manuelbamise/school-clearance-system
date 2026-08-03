import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(iso: string): string {
  const date = new Date(iso)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (Number.isNaN(seconds) || seconds < 0) return ''
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
