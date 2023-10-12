'use client'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {CodeEditor} from '@/components/ui/code-editor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Separator} from '@/components/ui/separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {fetcher} from '@/lib/fetcher'
import {cn, getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import MDEditor from '@uiw/react-md-editor'
import {useParams, usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'
import useSWR from 'swr'
import {QuizDetails} from '../../create/components/quiz-details'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form} from '@/components/ui/form'
import {StatusCode} from '@/enums'
import {toast} from '@/components/ui/use-toast'
import {Icons} from '@/components/ui/icons'
import {QuizTestCaseForm} from '../../create/components/quiz-solution'
import {IQuizTestCaseProps} from '@/types'

export function SectionHeader({
  title,
  subTitle,
}: {
  title: string
  subTitle?: string
}) {
  return (
    <>
      <h3 className='text-lg font-medium'>{title}</h3>
      {subTitle && <p className='text-sm text-muted-foreground'>{subTitle}</p>}
    </>
  )
}

function RowData({
  name,
  value,
  className,
}: {
  name: string
  value: string
  className?: any
}) {
  return (
    <div
      className={cn(className, 'flex justify-between items-center space-x-10')}
    >
      <p className='flex-none self-start w-32 text-sm text-muted-foreground'>
        {name}
      </p>
      <p className='line-clamp-2'>{value}</p>
    </div>
  )
}

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  codeLanguageId: z.string({required_error: 'Please select a coding language'}),
  difficultyLevelId: z.string({
    required_error: 'Please select a coding language',
  }),
})

export default function MainComponent({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const param = useParams()
  const {data, mutate} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/${param.qid}`,
    fetcher,
  )
  const [instruction, setInstruction] = useState('**Hello world!!!**')
  const [solution, setSolution] = useState('')
  const [testRunner, setTestRunner] = useState('')
  const form = useForm<z.infer<typeof formSchema>>({
    // TODO: type
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      title: '',
    },
  })

  useEffect(() => {
    if (data) {
      const quizData = data.data.quizData
      const quizTitle = quizData.title
      const quizDifficultyLevelId = quizData.difficultyLevelId
      const quizCodeLanguageId = quizData.codeLanguageId
      form.reset({
        title: quizTitle,
        codeLanguageId: quizCodeLanguageId.toString(),
        difficultyLevelId: quizDifficultyLevelId.toString(),
      })
    }
  }, [data])

  if (!data || !data.data) {
    return <></>
  }

  const {quizData, quizSolution, quizTestCase} = data.data
  const codeLanguage = getCodeLanguage(quizData.codeLanguageId).pretty
  const difficultyLevel = getDifficultyLevel(quizData.difficultyLevelId).name

  const testCaseContent = quizTestCase.map(
    (test: IQuizTestCaseProps, i: number) => {
      return (
        <div className='space-y-2'>
          <p>Test case {i + 1}</p>
          <div>
            <RowData name='Input' value={test.input} />
            <RowData name='Output' value={test.output} />
          </div>
        </div>
      )
    },
  )

  return (
    <div className='space-y-16 w-2/4'>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Basic Configuration' />
          <Form {...form}>
            <BasicConfigurationDialog
              handleSubmit={form.handleSubmit}
              mutate={mutate}
            >
              <Button variant={'outline'}>Edit</Button>
            </BasicConfigurationDialog>
          </Form>
        </div>
        <Separator className='my-6' />
        <Card className=''>
          <CardHeader></CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <RowData name={'Title'} value={quizData.title} />
            <RowData name={'Code langugage'} value={codeLanguage} />
            <RowData name={'Difficulty level'} value={difficultyLevel} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Instruction' />
          <QuizInstructionDialog
            defaultValue={quizData.instruction}
            mutate={mutate}
          >
            <Button variant={'outline'}>Edit</Button>
          </QuizInstructionDialog>
        </div>
        <Separator className='my-6' />
        <MDEditor
          className='border-white'
          height={400}
          data-color-mode='light'
          value={quizData.instruction}
          // TODO: any type
          onChange={setInstruction as any}
          hideToolbar={true}
          preview='preview'
          {...props}
        />
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Solution' />
          <QuizSolutionDialog
            solutionId={quizSolution[0].id}
            defaultSolutionValue={quizSolution[0].code}
            defaultTestRunnerValue={quizSolution[0].testRunner}
            codeLanguageId={quizData.codeLanguageId}
            testCases={quizTestCase}
            mutate={mutate}
          >
            <Button variant={'outline'}>Edit</Button>
          </QuizSolutionDialog>
        </div>
        <Separator className='my-6' />
        <Tabs defaultValue='solution' className=''>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='solution'>Solution</TabsTrigger>
            <TabsTrigger value='testcase'>Test Cases</TabsTrigger>
          </TabsList>
          <TabsContent
            value='solution'
            className='bg-white p-1 border rounded-md shadow-sm'
            style={{height: '55vh'}}
          >
            <ReflexContainer className='z-0' orientation='vertical'>
              <ReflexElement className='left-pane'>
                <div className='pane-content'>
                  <p className='text-xs'>Solution</p>
                  <CodeEditor
                    value={quizSolution[0].code}
                    onChange={setSolution}
                    codeLanguageId={quizData.codeLanguageId}
                    readOnly={true}
                  />
                </div>
              </ReflexElement>
              <ReflexSplitter className='mx-1' />
              <ReflexElement className='right-pane'>
                <p className='text-xs'>Test runner</p>
                <div className='pane-content'>
                  <CodeEditor
                    value={quizSolution[0].testRunner}
                    onChange={setTestRunner}
                    codeLanguageId={quizData.codeLanguageId}
                    readOnly={true}
                  />
                </div>
              </ReflexElement>
            </ReflexContainer>
          </TabsContent>
          <TabsContent value='testcase'>
            <Card
              className='flex justify-center items-center h-[50vh]'
              style={{height: '50vh'}}
            >
              <CardHeader className='space-y-6 w-2/3'>
                {testCaseContent}
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Danger zone' />
        </div>
        <Separator className='my-6' />
        <Card className='border-red-500'>
          <div className='flex justify-between items-center m-5'>
            <div>
              <p>Delete this coding quiz</p>
              <p className='text-sm text-muted-foreground'>
                Delete this coding quiz
              </p>
            </div>
            <DeleteQuizDialog title={quizData.title}>
              <Button variant='destructive' className=''>
                Delete
              </Button>
            </DeleteQuizDialog>
          </div>
        </Card>
      </div>
    </div>
  )
}

function BasicConfigurationDialog({children, handleSubmit, mutate}: any) {
  const [isLoading, setIsLoading] = useState(false)
  const param = useParams()
  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/update-quiz-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: param.qid}),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to create coding quiz.',
          variant: 'destructive',
        })
      }

      mutate()
      toast({
        title: 'Changes saved.',
      })
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <QuizDetails isLoading={isLoading} />
        <DialogFooter>
          <Button
            type='submit'
            disabled={isLoading}
            onClick={() => {
              handleSubmit(onSubmit)()
            }}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function QuizInstructionDialog({children, defaultValue, mutate}: any) {
  const [isLoading, setIsLoading] = useState(false)
  const [instruction, setInstruction] = useState(defaultValue)
  const param = useParams()
  const onSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/update-quiz-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({instruction, id: param.qid}),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to save changes.',
          variant: 'destructive',
        })
      }

      mutate()
      toast({
        title: 'Changes saved.',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[100rem]'>
        <DialogHeader>
          <DialogTitle>Edit instruction</DialogTitle>
          <DialogDescription>
            Make changes to your coding quiz instruction here.
          </DialogDescription>
        </DialogHeader>
        <MDEditor
          className='border-white'
          height={700}
          data-color-mode='light'
          value={instruction}
          onChange={setInstruction}
          overflow={false}
        />
        <DialogFooter>
          <Button
            type='submit'
            disabled={isLoading}
            onClick={() => {
              onSubmit()
            }}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const testCaseFormSchema = z.object({
  input1: z.string().min(1, {message: 'Please type in the input'}),
  input2: z.string().min(1, {message: 'Please type in the input'}),
  output1: z.string().min(1, {message: 'Please type in the output'}),
  output2: z.string().min(1, {message: 'Please type in the output'}),
})

function QuizSolutionDialog({
  children,
  solutionId,
  defaultSolutionValue,
  defaultTestRunnerValue,
  codeLanguageId,
  testCases,
  mutate,
}: any) {
  const [isLoading, setIsLoading] = useState(false)
  const [solution, setSolution] = useState(defaultSolutionValue)
  const [testRunner, setTestRunner] = useState(defaultTestRunnerValue)
  const form = useForm<z.infer<typeof testCaseFormSchema>>({
    resolver: zodResolver(testCaseFormSchema as any),
    defaultValues: {
      input1: '',
      input2: '',
      output1: '',
      output2: '',
    },
  })

  useEffect(() => {
    if (testCases) {
      form.reset({
        input1: testCases[0]?.input ?? '',
        input2: testCases[1]?.input ?? '',
        output1: testCases[0]?.output ?? '',
        output2: testCases[1]?.output ?? '',
      })
    }
  }, [codeLanguageId])

  const onSubmit = async (data: z.infer<typeof testCaseFormSchema>) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/update-quiz-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solution: [{code: solution, solutionId, testRunner}],
          testCases: [
            {
              testCaseId: testCases[0].id,
              input: data.input1,
              output: data.output1,
            },
            {
              testCaseId: testCases[1].id,
              input: data.input2,
              output: data.output2,
            },
          ],
        }),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to save changes.',
          variant: 'destructive',
        })
      }

      mutate()
      toast({
        title: 'Changes saved.',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[100rem]'>
        <DialogHeader>
          <DialogTitle>Edit solution</DialogTitle>
          <DialogDescription>
            Make changes to your coding quiz solution here.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='solution' className=''>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='solution'>Solution</TabsTrigger>
            <TabsTrigger value='testcase'>Test Cases</TabsTrigger>
          </TabsList>
          <TabsContent
            value='solution'
            className='bg-white p-1 border rounded-md shadow-sm'
            style={{height: '55vh'}}
          >
            <ReflexContainer orientation='vertical'>
              <ReflexElement className='left-pane'>
                <div className='pane-content'>
                  <p className='text-xs'>Solution</p>
                  <CodeEditor
                    value={solution}
                    onChange={setSolution}
                    codeLanguageId={codeLanguageId}
                  />
                </div>
              </ReflexElement>
              <ReflexSplitter className='mx-1' />
              <ReflexElement className='right-pane'>
                <p className='text-xs'>Test runner</p>
                <div className='pane-content'>
                  <CodeEditor
                    value={testRunner}
                    onChange={setTestRunner}
                    codeLanguageId={codeLanguageId}
                  />
                </div>
              </ReflexElement>
            </ReflexContainer>
          </TabsContent>
          <TabsContent value='testcase'>
            <Form {...form}>
              <form>
                <QuizTestCaseForm />
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            type='submit'
            disabled={isLoading}
            onClick={() => {
              form.handleSubmit(onSubmit)()
            }}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteQuizDialog({children, title}: any) {
  const router = useRouter()
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [input, setInput] = useState('')
  const param = useParams()

  useEffect(() => {
    if (input === title) {
      setIsDisabled(false)
    } else if (!isDisabled) {
      setIsDisabled(true)
    }
  }, [title, input])

  const onSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/delete-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({quizId: param.qid}),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to create coding quiz.',
          variant: 'destructive',
        })
      }

      toast({
        title: 'Coding quiz successfully deleted.',
        description: 'Redirecting...',
      })

      setTimeout(() => {
        router.push(`/${userRoleURLSegment}/quizzes`)
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete coding quiz</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            coding quiz?
          </DialogDescription>
        </DialogHeader>
        <div className='text-center my-4'>
          <p className='font-medium text-xl'>{title}</p>
        </div>
        <DialogFooter className=''>
          <div className='w-full flex flex-col sm:justify-center space-y-2'>
            <DialogDescription>
              To confirm, type "{title}" in the input box below
            </DialogDescription>
            <Input
              className='h-8'
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type='submit'
              className='h-8'
              disabled={isDisabled || isLoading}
              variant={'destructive'}
              onClick={() => {
                onSubmit()
              }}
            >
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Delete this coding quiz
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
