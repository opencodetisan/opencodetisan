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

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  codeLanguage: z.string({required_error: 'Please select a coding language'}),
  difficultyLevel: z.string({
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
  const codeLanguage = form.watch('codeLanguage')

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
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
          onClick={() => {
            form.handleSubmit(onSubmit)()
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
