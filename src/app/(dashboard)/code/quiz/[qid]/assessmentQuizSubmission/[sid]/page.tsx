'use client'

import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {PageHeader} from '@/components/ui/page-header'
import ReactMarkdown from 'react-markdown'
import 'github-markdown-css/github-markdown-light.css'
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
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {CodeEditor} from '@/components/ui/code-editor'
import 'react-reflex/styles.css'

export default function CandidateAssessment() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const param = useParams()
  const {qid, sid} = param
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/${qid}`,
    fetcher,
  )

  if (!data) {
    return <></>
  }

  const {quizData, quizSolution, quizTestCase} = data.data

  async function onSubmit() {
    setIsLoading(true)

    try {
      const response = await fetch(
        '/api/candidate/assessment/quiz/submission/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizId: qid,
            code,
            assessmentQuizSubmissionId: sid,
          }),
        },
      )

      if (!response.ok) {
        setIsLoading(false)
        return toast({
          title: 'Server error',
          description: 'Failed to submit your solution.',
          variant: 'destructive',
        })
      }

      toast({
        title: 'You have recovered your password.',
        description: 'Redirecting to sign-in page',
      })

      // setTimeout(() => {
      //   router.push('/signin')
      // }, 2000)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Password recovery error: ${error.message}`)
      } else {
        console.log('Unexpected error', error)
      }
    }
  }

  return (
    <div className='p-2'>
      <ReflexContainer orientation='vertical'>
        <ReflexElement className='left-pane'>
          <div className='pane-content'>
            <ReflexContainer orientation='horizontal'>
              <ReflexElement>
                <Tabs defaultValue='instruction'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='instruction'>Instruction</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value='instruction'
                    className='markdown-body p-2 h-[35vh]'
                  >
                    <ReactMarkdown>{quizData.instruction}</ReactMarkdown>
                  </TabsContent>
                </Tabs>
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement>
                <Tabs defaultValue='output'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='output'>Output</TabsTrigger>
                    <TabsTrigger value='test-case'>Test Cases</TabsTrigger>
                  </TabsList>
                  <TabsContent value='output'></TabsContent>
                  <TabsContent value='test-case'></TabsContent>
                </Tabs>
              </ReflexElement>
            </ReflexContainer>
          </div>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement className='right-pane'>
          <div className='pane-content'>
            <CodeEditor value={code} onChange={setCode} />
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  )
}
