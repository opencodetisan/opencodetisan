'use client'

import {cn} from '@/lib/utils'
import Link from 'next/link'
import {LayersIcon} from '@radix-ui/react-icons'
import {Avatar, AvatarFallback, AvatarImage} from './avatar'

export function MainHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={cn(
        'h-full flex justify-between items-center space-x-4 lg:space-x-6 bg-white',
        className,
      )}
      {...props}
    >
      <LayersIcon className='w-6 h-6' />
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}
