import {PageHeader} from '@/components/ui/page-header'
import {RedirectButton} from '@/components/ui/redirect-button'
import {Separator} from '@/components/ui/separator'
import {ManyQuizCard} from './component/many-quiz-card'

export default function Quizzes() {
  return (
    <>
      <div className='flex justify-between px-72 py-12 bg-white'>
        <PageHeader title='Quizzes' />
        <RedirectButton title='Add' />
      </div>
      <Separator />
      <div className='px-72 pt-6'>
        <ManyQuizCard />
      </div>
    </>
  )
}
