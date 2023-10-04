'use client'

import {QuizCard} from '@/components/ui/quiz-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {fetcher} from '@/lib/fetcher'
import {useState} from 'react'
import useSWR from 'swr'

export function ManyQuizCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [showAll, setShowAll] = useState<'false' | 'true'>('false')
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-many-quizzes?showAll=${showAll}`,
    fetcher,
  )

  let content = <></>

  content = data?.map((quiz) => {
    return (
      <QuizCard
        key={quiz.id}
        title={quiz.title}
        difficultyLevelId={quiz.difficultyLevelId}
        quizId={quiz.id}
        codeLanguageId={quiz.codeLanguageId}
        updatedat={quiz.updatedAt}
        author={quiz.user.name}
      />
    )
  })

  return (
    <div className='space-y-5'>
      <div className='flex justify-end'>
        <Select
          onValueChange={(value: 'false' | 'true') => {
            setShowAll(value)
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='false'>Show my quizzes</SelectItem>
            <SelectItem value='true'>Show all</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={`${className} grid grid-cols-3 gap-4`} {...props}>
        {content}
      </div>
    </div>
  )
}
