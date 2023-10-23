'use client'

import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {Button} from './button'

export function RedirectButton({
  className,
  title,
  href,
  ...props
}: {
  className?: React.HTMLAttributes<HTMLElement>
  title: string
  href: string
}) {
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]

  return (
    <Link href={`/${userRoleURLSegment}${href}`}>
      <Button className={`${className}`} {...props}>
        {title}
      </Button>
    </Link>
  )
}
