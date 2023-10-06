'use client'

import {z} from 'zod'
import {QuizDetails} from './quiz-details'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardHeader} from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {createContext, useDeferredValue, useMemo, useState} from 'react'
import {QuizInstruction} from './quiz-instruction'
import {QuizSolution} from './quiz-solution'

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  codeLanguage: z.string({required_error: 'Please select a coding language'}),
  difficultyLevel: z.string({
    required_error: 'Please select a coding language',
  }),
})

export function CreateQuizForm({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [instruction, setInstruction] = useState('**Hello world!!!**')
  const [solution, setSolution] = useState('')
  const deferredSolution = useDeferredValue(solution)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })
  const codeLanguage = form.watch('codeLanguage')

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
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
        <QuizSolution solution={solution} setSolution={setSolution} />
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
