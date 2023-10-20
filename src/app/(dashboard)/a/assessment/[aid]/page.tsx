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
import {IQuizDataProps} from '@/types'

export default function Assessment() {
  const param = useParams()
  const {data, mutate} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/assessment/${param.aid}`,
    fetcher,
  )
  if (!data) {
    return <></>
  }

  const assessmentDetails = data.data.data
  const assessmentQuizzes = data.data.quizzes
  const assessmentCandidates = data.data.candidates

  const candidateRow = assessmentCandidates?.map((c) => {
    return (
      <TableRow key={c.id}>
        <TableCell className='font-medium'>{c.name}</TableCell>
        <TableCell>{c.email}</TableCell>
      </TableRow>
    )
  })

  const quizRow = assessmentQuizzes?.map((quiz: IQuizDataProps) => {
    if (!quiz) {
      return <></>
    }
    const codeLanguage = getCodeLanguage(quiz.codeLanguageId).pretty
    const difficultyLevel = getDifficultyLevel(quiz.difficultyLevelId).name
    return (
      <TableRow key={quiz.id}>
        <TableCell className='font-medium'>{quiz.title}</TableCell>
        <TableCell>{codeLanguage}</TableCell>
        <TableCell>{difficultyLevel}</TableCell>
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
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <SectionHeader title='Quizzes' />
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
        </div>
      </div>
    </div>
  )
}
