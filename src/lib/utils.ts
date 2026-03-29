import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-BD', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function getErrorMessage(error: unknown): string {
  if (axios_error(error)) {
    return error?.response?.data?.message || 'Something went wrong.'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function axios_error(error: any): error is { response?: { data?: { message?: string } } } {
  return error && typeof error === 'object' && 'response' in error
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Identity Services':  '🪪',
  'Business Services':  '🏢',
  'Land Services':      '🗺️',
  'Education Services': '🎓',
  'Social Services':    '🤝',
  'Health Services':    '🏥',
  'Tax & Finance':      '💰',
  'Utility Services':   '⚡',
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Identity Services':  'bg-blue-50 text-blue-700 border-blue-200',
  'Business Services':  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Land Services':      'bg-amber-50 text-amber-700 border-amber-200',
  'Education Services': 'bg-purple-50 text-purple-700 border-purple-200',
  'Social Services':    'bg-rose-50 text-rose-700 border-rose-200',
  'Health Services':    'bg-red-50 text-red-700 border-red-200',
  'Tax & Finance':      'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Utility Services':   'bg-cyan-50 text-cyan-700 border-cyan-200',
}
