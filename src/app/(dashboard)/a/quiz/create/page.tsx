import {PageHeader} from '@/components/ui/page-header'
import {CreateQuizForm} from './components/create-quiz-form'
import {Separator} from '@/components/ui/separator'

export default function CreateQuiz() {
  return (
    <div>
      <div className='flex justify-center py-12 bg-white'>
        <div className='w-3/5'>
          <PageHeader title={'Add Coding Quiz'} />
        </div>
      </div>
      <Separator />
      <div className='flex justify-center pt-6'>
        <CreateQuizForm className='w-3/5' />
      </div>
    </div>
  )
}
