'use client'

import {cn} from '@/lib/utils'
import Link from 'next/link'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        'h-full flex items-center space-x-4 lg:space-x-6',
        className,
      )}
      {...props}
    >
      <Link
        href='/examples/dashboard'
        className='text-sm font-medium transition-colors hover:text-primary h-full flex items-center border-b-2 border-black'
      >
        <p className='hover:bg-stone-200 px-3 py-1 my-2 rounded-md'>
          Dashboard
        </p>
      </Link>
      <Link
        href='/examples/dashboard'
        className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Assessment
      </Link>
      <Link
        href='/examples/dashboard'
        className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Quiz
      </Link>
      <Link
        href='/examples/dashboard'
        className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Settings
      </Link>
    </nav>
  )
}
