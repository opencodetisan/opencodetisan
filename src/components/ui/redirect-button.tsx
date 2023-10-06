'use client'

import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {Button} from './button'

export function RedirectButton({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]

  return (
    <Link href={`/${userRoleURLSegment}/quiz/create`}>
      <Button className={`${className}`} {...props}>
        {title}
      </Button>
    </Link>
  )
}
