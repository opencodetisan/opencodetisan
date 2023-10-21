'use client'

import {fetcher} from '@/lib/fetcher'
import useSWR from 'swr'
import {AssessmentCard} from './assessment-card'

export function ManyAssessmentCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-many-assessments`,
    fetcher,
  )

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
}

// <div className='flex justify-end'>
//   <Select
//     onValueChange={(value: 'false' | 'true') => {
//       setShowAll(value)
//     }}
//   >
//     <SelectTrigger className='w-[180px]'>
//       <SelectValue placeholder='Filter' />
//     </SelectTrigger>
//     <SelectContent>
//       <SelectItem value='false'>Show my quizzes</SelectItem>
//       <SelectItem value='true'>Show all</SelectItem>
//     </SelectContent>
//   </Select>
// </div>
