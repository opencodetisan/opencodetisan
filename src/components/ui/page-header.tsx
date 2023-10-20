'use client'
import {cn} from '@/lib/utils'

export function PageHeader({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <h2
      className={cn('text-3xl tracking-tight font-semibold', className)}
      {...props}
    >
      {title}
    </h2>
  )
}
