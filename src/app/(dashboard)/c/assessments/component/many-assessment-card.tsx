'use client'

import {fetcher} from '@/lib/fetcher'
import useSWR from 'swr'
import {AssessmentCard} from './assessment-card'

export function ManyAssessmentCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {data} = useSWR(
    `/api/candidate/assessment`,
    fetcher,
  )
  try {

    if (data.error) {
      return <div></div>
    }

    let content = <></>

    // TODO: type
    content = data?.map((assessment: any) => {
      return (
        <AssessmentCard
          key={assessment.id}
          id={assessment.id}
          title={assessment.title}
          description={assessment.description}
          owner={assessment.owner.name}
          candidateAmount={assessment.assessmentCandidates.length}
          assessmentCandidates={assessment.assessmentCandidates}
          createdat={assessment.createdAt}
        />
      )
    })

    return (
      <div className='space-y-5'>
        <div className={`${className} grid grid-cols-3 gap-4`} {...props}>
          {content}
        </div>
      </div>
    )
  } catch (e) {
    return <div></div>
  }
}
