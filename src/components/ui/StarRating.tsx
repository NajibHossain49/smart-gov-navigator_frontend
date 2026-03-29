'use client'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onChange }: Props) {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size], 'transition-colors',
            i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200',
            interactive && 'cursor-pointer hover:fill-amber-300 hover:text-amber-300'
          )}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  )
}
