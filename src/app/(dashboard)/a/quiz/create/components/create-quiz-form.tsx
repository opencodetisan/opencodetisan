'use client'

import {z} from 'zod'
import {QuizDetails} from './quiz-details'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from '@/components/ui/use-toast'
import {Form} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {useDeferredValue, useState} from 'react'
import {QuizInstruction} from './quiz-instruction'
import {QuizSolution} from './quiz-solution'
import {CodeEditorContext} from './context'
import {StatusCode} from '@/enums'
import {usePathname, useRouter} from 'next/navigation'
import {Icons} from '@/components/ui/icons'

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  codeLanguageId: z.string({required_error: 'Please select a coding language'}),
  difficultyLevelId: z.string({
    required_error: 'Please select a coding language',
  }),
  input1: z.string().min(1, {message: 'Please type in the input'}),
  input2: z.string().min(1, {message: 'Please type in the input'}),
  output1: z.string().min(1, {message: 'Please type in the output'}),
  output2: z.string().min(1, {message: 'Please type in the output'}),
})

export function CreateQuizForm({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter()
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]
  const [isLoading, setIsLoading] = useState(false)
  const [instruction, setInstruction] = useState('**Hello world!!!**')
  const [solution, setSolution] = useState('')
  const deferredSolution = useDeferredValue(solution)
  const [testRunner, setTestRunner] = useState('')
  const deferredTestRunner = useDeferredValue(testRunner)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      input1: '',
      input2: '',
      output1: '',
      output2: '',
    },
  })
  const codeLanguage = form.watch('codeLanguageId')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, instruction, solution, testRunner}),
      })

      if (response.status === StatusCode.InternalServerError) {
        setIsLoading(false)
        return toast({
          title: 'Internal server error',
          description: 'Failed to create coding quiz.',
          variant: 'destructive',
        })
      }

      toast({
        title: 'You have successfully created a coding quiz.',
        description: 'Redirecting ...',
      })

      setTimeout(() => {
        router.push(`/${userRoleURLSegment}/quizzes`)
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`${className} space-y-16`}>
      <Form {...form}>
        <form>
          <div>
            <h3 className='text-lg font-medium'>Basic Configurations</h3>
            <p className='text-sm text-muted-foreground'>
              Configure the basic configurations for your quiz.
            </p>
          </div>
          <Separator className='my-6' />
          <QuizDetails />
        </form>
      </Form>
      <div>
        <div>
          <h3 className='text-lg font-medium'>Instruction</h3>
          <p className='text-sm text-muted-foreground'>
            Configure the basic configurations for your quiz.
          </p>
        </div>
        <Separator className='my-6' />
        <QuizInstruction
          instruction={instruction}
          setInstruction={setInstruction}
        />
      </div>
      <div>
        <div>
          <h3 className='text-lg font-medium'>Solution</h3>
          <p className='text-sm text-muted-foreground'>
            Configure the basic configurations for your quiz.
          </p>
        </div>
        <Separator className='my-6' />
        <CodeEditorContext.Provider value={{codeLanguage}}>
          <Form {...form}>
            <QuizSolution
              solution={deferredSolution}
              setSolution={setSolution}
              testRunner={deferredTestRunner}
              setTestRunner={setTestRunner}
              codeLanguage={codeLanguage}
            />
          </Form>
        </CodeEditorContext.Provider>
      </div>
      <div className='flex justify-end'>
        <Button
          disabled={isLoading}
          onClick={() => {
            form.handleSubmit(onSubmit)()
          }}
        >
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          Submit
        </Button>
      </div>
    </div>
  )
}
