import {PageHeader} from '@/components/ui/page-header'
import {RedirectButton} from '@/components/ui/redirect-button'
import {Separator} from '@/components/ui/separator'
import {ManyAssessmentCard} from './component/many-assessment-card'

export default function Assessments() {
  return (
    <>
      <div className='flex justify-between px-72 py-12 bg-white'>
        <PageHeader title='Assessments' />
        <RedirectButton title='Add assessment' href='/assessment/create' />
      </div>
      <Separator />
      <div className='px-72 pt-6'>
        <ManyAssessmentCard />
      </div>
    </>
  )
}
