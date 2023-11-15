import {PageHeader} from '@/components/ui/page-header'
import {RedirectButton} from '@/components/ui/redirect-button'
import {Separator} from '@/components/ui/separator'
import {ManyQuizCard} from './component/many-quiz-card'

export default function Quizzes() {
  return (
    <>
      <div className='flex justify-between px-32 2xl:px-52 py-12 bg-white'>
        <PageHeader title='Quizzes' />
        <RedirectButton title='Add' href='/quiz/create' />
      </div>
      <Separator />
      <div className='px-32 2xl:px-52 pt-6'>
        <ManyQuizCard />
      </div>
    </>
  )
}
