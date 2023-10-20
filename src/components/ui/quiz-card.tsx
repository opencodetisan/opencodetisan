'use client'

import {Card, CardHeader, CardTitle} from './card'
import {AvatarIcon} from '@radix-ui/react-icons'
import {Badge} from './badge'
import {getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {DateTime} from 'luxon'

export function QuizCard({
  className,
  title,
  difficultyLevelId,
  quizId,
  codeLanguageId,
  updatedat,
  author,
  ...props // TODO: type
}: any) {
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]
  const difficultyLevel = getDifficultyLevel(difficultyLevelId)
  const codeLanguage = getCodeLanguage(codeLanguageId)
  const updatedAt = DateTime.fromISO(updatedat).toLocaleString({
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/${userRoleURLSegment}/quiz/${quizId}`}>
      <Card className='hover:shadow-md hover:cursor-pointer h-full' {...props}>
        <CardHeader className='h-full'>
          <div className='flex flex-col space-y-5 h-full justify-between'>
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <Badge
                  variant='default'
                  className={`${difficultyLevel.color} rounded-lg`}
                >
                  {difficultyLevel.name}
                </Badge>
                <codeLanguage.icon className='text-2xl' />
              </div>
              <CardTitle className='text-lg line-clamp-2'>{title}</CardTitle>
            </div>
            <div className='flex justify-between items-center text-gray-400'>
              <div className='flex items-center w-36 space-x-1'>
                <div>
                  <AvatarIcon className='w-5 h-5' />
                </div>
                <p className='font-medium truncate ...'>{author}</p>
              </div>
              <p className='font-medium'>Updated {updatedAt}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
