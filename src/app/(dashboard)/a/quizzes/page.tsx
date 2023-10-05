'use client'

import {QuizCard} from '@/components/ui/quiz-card'
import {fetcher} from '@/lib/fetcher'
import useSWR from 'swr'

export default function Home() {
  const {data, error, isLoading} = useSWR('/api/get-many-quizzes', fetcher)
  // console.log(data)

  return (
    <div className='px-72 pt-6 bg-stone-50'>
      <div className='grid grid-cols-3 gap-4'>
        <QuizCard title={'yeet'} />
        <QuizCard title={'yeet'} />
        <QuizCard title={'yeet'} />
      </div>
    </div>
  )
}
