'use client'
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {PageHeader} from '@/components/ui/page-header'
import {Separator} from '@/components/ui/separator'
import {RowData, SectionHeader} from '../../quiz/[qid]/components'
import AssessmentDetailsDialog from './components/assessment-details-dialog'
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
import DataTableRowActions from './components/data-table-row-actions'
import {useState} from 'react'
import {toast} from '@/components/ui/use-toast'
import {AddCandidateDialog, columns} from '../create/component'
import {QuizTableDialog} from './components/quiz-adding-dialog'
import DeleteQuizDropdown from './components/delete-quiz-dropdown'

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

export default function Assessment() {
  const param = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const {data, mutate} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/assessment/${param.aid}`,
    fetcher,
  )
  const {data: quizTableData, mutate: mutateQuizTable} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz?showAll=true&aid=${param.aid}`,
    fetcher,
  )

  if (!data) {
    return <></>
  }

  const assessmentDetails = data.data.data
  const assessmentQuizzes = data.data.quizzes
  const assessmentCandidates = data.data.candidates
  const assessmentSubmissions = data.data.submissions
  const assessmentId = assessmentDetails.id

  const startAt = dateFormatter(assessmentDetails.startAt)
  const endAt = dateFormatter(assessmentDetails.endAt)

  // TODO
  // @ts-ignore
  const submissionRow = assessmentSubmissions?.map((s) => {
    let status = AssessmentQuizStatus.Pending
    let totalPoint = 0
    let comparativeScore = 0
    const isCompleted = s.data.every(
      // TODO
      // @ts-ignore
      (e) => e.status === AssessmentQuizStatus.Completed,
    )
    if (isCompleted) {
      status = AssessmentQuizStatus.Completed
    }

    return (
      <TableRow key={s.id}>
        <TableCell className='font-medium'>{s.name}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{totalPoint}</TableCell>
        <TableCell>{comparativeScore}</TableCell>
      </TableRow>
    )
  })

  const onAssessmentCandidateDelete = async (id: string) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/assessment-candidate', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: assessmentDetails.id,
          candidateId: id,
        }),
      })

      if (!response.ok) {
        return toast({
          title: 'Server error',
          description: 'Failed to recover password.',
        })
      }

      mutate()
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Password recovery error: ${error.message}`)
      } else {
        console.log('Unexpected error', error)
      }
    }
  }

  const candidateRow = assessmentCandidates?.map(
    (c: IAssessmentCandidateProps) => {
      return (
        <TableRow key={c.id}>
          <TableCell className='font-medium'>{c.name}</TableCell>
          <TableCell>{c.email}</TableCell>
          <TableCell className='w-[100px] text-right'>
            <DataTableRowActions
              onAssessmentCandidateDelete={() =>
                onAssessmentCandidateDelete(c.id)
              }
            />
          </TableCell>
        </TableRow>
      )
    },
  )

  const onQuizDelete = async (qid: string) => {
    try {
      const response = await fetch(
        `/api/assessment/${assessmentDetails.id}/quiz/${qid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      )
      if (!response.ok) {
        return toast({
          title: 'Server error',
          description: 'Failed to recover password.',
        })
      }
      mutateQuizTable()
      mutate()
    } catch (error) {
      console.log('Unexpected error', error)
    }
  }

  const quizRow = assessmentQuizzes?.map((quiz: IQuizDataProps) => {
    if (!quiz) {
      return <></>
    }
    const codeLanguage = getCodeLanguage(quiz.codeLanguageId).pretty
    const difficultyLevel = getDifficultyLevel(quiz.difficultyLevelId).name
    return (
      <TableRow key={quiz.id}>
        <TableCell className='font-medium w-96 line-clamp-2'>
          {quiz.title}
        </TableCell>
        <TableCell>{codeLanguage}</TableCell>
        <TableCell>{difficultyLevel}</TableCell>
        <TableCell className='w-[100px] text-right'>
          <DeleteQuizDropdown onQuizDelete={() => onQuizDelete(quiz.id)} />
        </TableCell>
      </TableRow>
    )
  })

  const addCandidates = async (candidates: string[]) => {
    try {
      const response = await fetch(`/api/assessment/candidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({newCandidateEmails: candidates, assessmentId}),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to add candidates.',
          variant: 'destructive',
        })
      }

      mutate()
      toast({
        title: `You have invited ${candidates.length} candidates.`,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const addAssessmentQuiz = async ({
    rowSelection,
  }: {
    rowSelection: {[key: string]: boolean}
  }) => {
    const quizIds = Object.keys(rowSelection).map(
      (rowId) => rowId.split('/')[0],
    )
    try {
      const response = await fetch('/api/assessment-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizIds,
          assessmentId,
        }),
      })

      if (response.status === StatusCode.InternalServerError) {
        setIsLoading(false)
        return toast({
          title: 'Internal server error',
          description: 'Failed to add assessment quiz.',
          variant: 'destructive',
        })
      }

      mutate()
      mutateQuizTable()
      toast({
        title: 'You have added some quizzes.',
      })
    } catch (error) {
      console.log(error)
    }
  }

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
              <SectionHeader title='Basic Configuration' />
              <AssessmentDetailsDialog
                mutate={mutate}
                title={assessmentDetails.title}
                description={assessmentDetails.description}
              >
                <Button variant={'outline'}>Edit</Button>
              </AssessmentDetailsDialog>
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
              <SectionHeader title='Quizzes' />
              <QuizTableDialog
                data={quizTableData}
                columns={columns}
                addAssessmentQuiz={addAssessmentQuiz}
              >
                <Button variant={'outline'}>Edit</Button>
              </QuizTableDialog>
            </div>
            <Separator className='my-6' />
            <Card className=''>
              <Table>
                <TableCaption className='mb-3'>
                  A list of your selected quizzes.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Code Language</TableHead>
                    <TableHead>Difficulty Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{quizRow}</TableBody>
              </Table>
            </Card>
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <SectionHeader title='Candidates' />
              <AddCandidateDialog
                candidateEmails={[]}
                setCandidateEmails={() => {}}
                addCandidates={addCandidates}
              >
                <Button variant={'outline'}>Edit</Button>
              </AddCandidateDialog>
            </div>
            <Separator className='my-6' />
            <Card className=''>
              <Table>
                <TableCaption className='mb-3'>
                  A list of your selected candidates.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{candidateRow}</TableBody>
              </Table>
            </Card>
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <SectionHeader title='Candidate Submissions' />
            </div>
            <Separator className='my-6' />
            <Card className=''>
              <Table>
                <TableCaption className='mb-3'>
                  A list of candidate submissions.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Point</TableHead>
                    <TableHead>Comparative score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{submissionRow}</TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
