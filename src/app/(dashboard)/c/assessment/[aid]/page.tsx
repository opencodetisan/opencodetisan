'use client'

import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {PageHeader} from '@/components/ui/page-header'
import {Separator} from '@/components/ui/separator'
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
import {DateTime} from 'luxon'
import {RowData, SectionHeader} from '@/app/(dashboard)/a/quiz/[qid]/components'
import {useState} from 'react'
import {StatusCode} from '@/enums'
import {toast} from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Icons} from '@/components/ui/icons'

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
          <StartQuizDialog title={quiz.title} assessmentResultId={e.id}>
            <Button>Start</Button>
          </StartQuizDialog>
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

function StartQuizDialog({
  children,
  title,
  assessmentResultId,
}: {
  children: any
  title: string
  assessmentResultId: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const param = useParams()

  // TODO: type
  const onStart = async (data: any) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/candidate/assessment/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({assessmentResultId}),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to start coding quiz assessment.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Start coding quiz</DialogTitle>
          <DialogDescription>
            {`You are about to start the coding quiz assessment. Click 'Start' to proceed.`}
          </DialogDescription>
        </DialogHeader>
        <Card className='p-3'>
          <div className='flex items-center space-x-2'>
            <p>Title:</p>
            <p className='font-medium'>{title}</p>
          </div>
        </Card>
        <DialogFooter>
          <Button disabled={isLoading} onClick={onStart}>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
