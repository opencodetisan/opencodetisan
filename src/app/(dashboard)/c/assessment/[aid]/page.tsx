'use client'

import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {PageHeader} from '@/components/ui/page-header'
import {Separator} from '@/components/ui/separator'
// import {RowData, SectionHeader} from '../../quiz/[qid]/components'
// import AssessmentDetailsDialog from './components/assessment-details-dialog'
import {Button} from '@/components/ui/button'
import useSWR from 'swr'
import {fetcher} from '@/lib/fetcher'
import {useParams} from 'next/navigation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import {IQuizDataProps, IQuizProps, IUserProps} from '@/types'
import {AssessmentQuizStatus, StatusCode} from '@/enums'
import {DateTime} from 'luxon'
import {useState} from 'react'
import {toast} from '@/components/ui/use-toast'
import {RowData, SectionHeader} from '@/app/(dashboard)/a/quiz/[qid]/components'
// import {AddCandidateDialog, columns} from '../create/component'
// import {QuizTableDialog} from './components/quiz-adding-dialog'
// import DeleteQuizDropdown from './components/delete-quiz-dropdown'
// import CandidateRowActions from './components/data-table-row-actions'
// import QuizDeleteDialog from './components/quiz-delete-dialog'

interface IAssessmentCandidateProps extends IUserProps {
  email: string
}

const dateFormatter = (ISOString: string) => {
  return DateTime.fromISO(ISOString).toLocaleString({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CandidateAssessment() {
  const param = useParams()
  const {data, mutate} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/candidate/assessment/${param.aid}`,
    fetcher,
  )

  console.log(data)
  if (!data || !data.data) {
    return <></>
  }

  const assessmentDetails = data.data.assessment
  const codingQuizzes = data.data.codingQuizzes
  const startAt = dateFormatter(assessmentDetails.startAt)
  const endAt = dateFormatter(assessmentDetails.endAt)

  // TODO
  // @ts-ignore
  const codingQuizRow = codingQuizzes?.map((e) => {
    const quiz = e.quiz

    return (
      <TableRow key={quiz.id}>
        <TableCell className='font-medium w-fit'>
          <p className='w-[20rem] line-clamp-2'>{quiz.title}</p>
        </TableCell>
        <TableCell className=''>{e.status}</TableCell>
        <TableCell className=''>{e.timeTaken}</TableCell>
        <TableCell className=''>
          <Button>Start</Button>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <div>
      <div className='flex justify-center py-12 bg-white'>
        <div className='w-2/4'>
          <PageHeader title='Assessments' />
        </div>
      </div>
      <Separator />
      <div className={`flex justify-center pt-6`}>
        <div className='space-y-16 w-2/4'>
          <div>
            <div className='flex justify-between items-center'>
              <SectionHeader title='Assessment Details' />
            </div>
            <Separator className='my-6' />
            <Card className=''>
              <CardHeader></CardHeader>
              <CardContent className='space-y-2 text-sm'>
                <RowData name={'Title'} value={assessmentDetails.title} />
                <RowData
                  name={'Description'}
                  value={assessmentDetails.description}
                />
                <RowData name={'Starting date'} value={startAt} />
                <RowData name={'Ending date'} value={endAt} />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <SectionHeader title='Coding Quizzes' />
            </div>
            <Separator className='my-6' />
            <Card className=''>
              <Table>
                <TableCaption className='mb-3'>
                  A list of your assigned coding quizzes.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{codingQuizRow}</TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
