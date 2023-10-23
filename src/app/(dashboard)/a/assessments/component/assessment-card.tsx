'use client'

import {AvatarIcon} from '@radix-ui/react-icons'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {DateTime} from 'luxon'
import {Card, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {PersonIcon} from '@radix-ui/react-icons'
import {AssessmentStatus} from '@/enums'
import {TooltipProvider} from '@radix-ui/react-tooltip'
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip'
import {IAssessmentCandidateProps} from '@/types'

export function AssessmentCard({
  className,
  id,
  title,
  description,
  difficultyLevelId,
  quizId,
  codeLanguageId,
  createdat,
  candidateAmount,
  owner,
  assessmentCandidates,
  ...props // TODO: type
}: any) {
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]
  const createdAt = DateTime.fromISO(createdat).toLocaleString({
    month: 'long',
    year: 'numeric',
  })
  const isCompleted = assessmentCandidates[0]
    ? assessmentCandidates.every(
        (c: IAssessmentCandidateProps) => c.status === AssessmentStatus.PENDING,
      )
    : false

  return (
    <Link href={`/${userRoleURLSegment}/assessment/${id}`}>
      <Card className='hover:shadow-md hover:cursor-pointer h-full' {...props}>
        <CardHeader className='h-full'>
          <div className='flex flex-col space-y-5 h-full justify-between'>
            <div className='space-y-1'>
              <div className='flex justify-between items-center'>
                <Badge
                  variant='default'
                  className={`${
                    isCompleted ? 'bg-green-600' : 'bg-gray-400'
                  } rounded-lg`}
                >
                  {isCompleted
                    ? AssessmentStatus.COMPLETED
                    : AssessmentStatus.PENDING}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center space-x-2'>
                        <PersonIcon className='text-2xl' />
                        <p>{candidateAmount}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-black text-white text-xs'>
                      <p>Candidates</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardTitle className='text-lg line-clamp-2'>{title}</CardTitle>
              <p className='line-clamp-2 text-secondary-foreground'>
                {description}
              </p>
            </div>
            <div className='flex justify-between items-center text-gray-400'>
              <div className='flex items-center w-36 space-x-1'>
                <div>
                  <AvatarIcon className='w-5 h-5' />
                </div>
                <p className='font-medium truncate ...'>{owner}</p>
              </div>
              <p className='font-medium'>{createdAt}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
