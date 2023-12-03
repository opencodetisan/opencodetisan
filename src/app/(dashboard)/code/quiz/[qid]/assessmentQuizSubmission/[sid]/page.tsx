'use client'

import ReactMarkdown from 'react-markdown'
import 'github-markdown-css/github-markdown-light.css'
import {Button} from '@/components/ui/button'
import useSWR from 'swr'
import {fetcher} from '@/lib/fetcher'
import {useParams, useRouter} from 'next/navigation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {useEffect, useState} from 'react'
import {toast} from '@/components/ui/use-toast'
import {Icons} from '@/components/ui/icons'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {CodeEditor} from '@/components/ui/code-editor'
import 'react-reflex/styles.css'
import {useDebounce} from 'use-debounce'
import {IQuizTestCaseProps} from '@/types'
import {record} from 'rrweb'
import {StatusCode} from '@/enums'

// TODO: type
let stopRrwebRecord: any
let events: any = []
let rrwebRecordInterval: NodeJS.Timeout

export default function CandidateAssessment() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const [debouncedCode] = useDebounce(code, 1000)
  const param = useParams()
  const {qid, sid} = param
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/${qid}`,
    fetcher,
  )

  let quizId = ''

  const saveSessionRecord = async () => {
    if (events.length === 0) {
      return
    }

    const result = await fetch(`/api/session-replay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        assessmentQuizSubId: sid,
      }),
    })
    const json = await result.json()

    if (json.status === StatusCode.InternalServerError) {
      return toast({
        title: 'Internal server error',
        description: 'Failed to record session.',
        variant: 'destructive',
      })
    }
    events = []
  }

  useEffect(() => {
    if (debouncedCode && debouncedCode.trim() !== '') {
      localStorage.setItem(quizId, debouncedCode)
    }
  }, [debouncedCode, quizId])

  useEffect(() => {
    const storedCode = localStorage.getItem(quizId)
    if (storedCode) {
      setCode(storedCode)
    }
  }, [quizId, data, setCode])

  useEffect(() => {
    stopRrwebRecord = record({
      emit(e) {
        events.push(e)
      },
    })
    rrwebRecordInterval = setInterval(saveSessionRecord, 30000)
  }, [])

  if (!data) {
    return <></>
  }

  const {quizData, quizTestCase} = data.data
  quizId = quizData.id

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

      const res = await response.json()
      const assessmentId = res.assessmentId

      if (events.length > 0 && stopRrwebRecord) {
        stopRrwebRecord()
        clearInterval(rrwebRecordInterval)
        await saveSessionRecord()
      }

      toast({
        title: 'You have submitted your solution.',
        description: 'Redirecting...',
      })

      setTimeout(() => {
        router.push(`/c/assessment/${assessmentId}`)
      }, 2000)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Password recovery error: ${error.message}`)
      } else {
        console.log('Unexpected error', error)
      }
    }
  }

  const testCaseList = quizTestCase.map((test: IQuizTestCaseProps) => {
    return (
      <TableRow key={test.id}>
        <TableCell>{test.input}</TableCell>
        <TableCell>{test.output}</TableCell>
      </TableRow>
    )
  })

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
                  <TabsContent value='test-case' className='bg-white'>
                    <Table>
                      <TableCaption className='mb-3'>
                        A list of test cases.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Input</TableHead>
                          <TableHead>Output</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>{testCaseList}</TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </ReflexElement>
            </ReflexContainer>
          </div>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement className='right-pane'>
          <div className='pane-content'>
            <CodeEditor
              value={code}
              onChange={setCode}
              codeLanguageId={quizData.codeLanguageId}
              height='84vh'
            />
            <div className='flex justify-end w-full'>
              <Button onClick={onSubmit} disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}
                Submit
              </Button>
            </div>
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  )
}
