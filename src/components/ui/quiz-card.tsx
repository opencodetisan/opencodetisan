// 'use client'

import {cn} from '@/lib/utils'
import Link from 'next/link'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './card'
import {Button} from './button'

export function QuizCard({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <Card>
      <CardHeader className='grid grid-cols-[1fr_110px] items-start gap-4 space-y-0'>
        <div className='space-y-1'>
          <CardTitle>shadcn/ui{title}</CardTitle>
          <CardDescription>
            Beautifully designed components built with Radix UI and Tailwind
            CSS.
          </CardDescription>
        </div>
        <div className='flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground'>
          <Button variant='secondary' className='px-3 shadow-none'>
            Star
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex space-x-4 text-sm text-muted-foreground'>
          <div className='flex items-center'>TypeScript</div>
          <div className='flex items-center'>20k</div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  )
}
