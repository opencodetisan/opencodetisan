import {PageHeader} from '@/components/ui/page-header'
import {Separator} from '@/components/ui/separator'
import {CreateQuizForm} from '../../quiz/create/components/create-quiz-form'
import {CreateAssessmentMain} from './component'

export default function CreateAssessment() {
  return (
    <div>
      <div className='flex justify-center py-12 bg-white'>
        <div className='w-3/5'>
          <PageHeader title={'Add Assessment'} />
        </div>
      </div>
      <Separator />
      <div className='flex justify-center pt-6'>
        <CreateAssessmentMain className='w-3/5' />
      </div>
    </div>
  )
}
