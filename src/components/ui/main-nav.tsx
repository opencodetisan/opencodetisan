'use client'

import {cn} from '@/lib/utils'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const navLinks = [
    {name: 'Dashboard', href: ''},
    {name: 'Assessments', href: ''},
    {name: 'Quizzes', href: '/a/quizzes'},
    {name: 'Users', href: ''},
    {name: 'Settings', href: ''},
  ]

  const components = navLinks.map((link) => {
    const pathname = usePathname()
    const isActive = pathname === link.href

    return (
      <Link
        href={link.href}
        className={`relative text-sm font-normal transition-colors h-full flex items-center ${
          isActive ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <p className='hover:bg-zinc-200 hover:text-primary px-3 py-1 my-2 rounded-md'>
          {link.name}
        </p>
        <div
          className={`absolute bottom-0 left-4 right-4 border-b-2 border-black transform translate-y-0.5 ${
            isActive ? '' : 'hidden'
          }`}
        ></div>
      </Link>
    )
  })

  return (
    <nav className={cn('h-full flex items-center ', className)} {...props}>
      {components}
    </nav>
  )
}
