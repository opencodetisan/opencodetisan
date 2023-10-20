'use client'

import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {StatusCode} from '@/enums'
import {usePathname, useRouter} from 'next/navigation'
import {Icons} from '@/components/ui/icons'
import {AssessmentDetails} from './assessment-details'
import {useEffect, useState} from 'react'
import {SectionHeader} from '../../../quiz/[qid]/components'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import {ArrowUpDown} from 'lucide-react'
import {Checkbox} from '@/components/ui/checkbox'
import {ColumnDef} from '@tanstack/react-table'
import {fetcher} from '@/lib/fetcher'
import {DataTable} from '@/components/ui/data-table'
import useSWR from 'swr'
import SelectedQuizTable from './selected-quiz-table'
import {Card} from '@/components/ui/card'
import {IQuizDataProps} from '@/types'
import {Textarea} from '@/components/ui/textarea'
import {DialogClose} from '@radix-ui/react-dialog'
import CandidateEmailTable from './candidate-email-table'

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  description: z.string(),
  startAt: z.string({required_error: 'Date cannot be empty'}),
  endAt: z.string({required_error: 'Date cannot be empty'}),
})

type IQuiz = {
  id: string
  title: string
  codeLanguageId: number
  difficultyLevelId: number
}

export const columns: ColumnDef<IQuiz>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'codeLangugage',
    header: 'Code Language',
    cell: ({row}) => {
      const codeLanguageId = row.getValue('codeLangugageId')
      const codeLanguage = getCodeLanguage(codeLanguageId).pretty
      return <div>{codeLanguage}</div>
    },
  },
  {
    accessorKey: 'difficultyLevel',
    header: 'Difficulty Level',
    cell: ({row}) => {
      const difficultyLevelId = row.getValue('difficultyLevelId')
      const difficultyLevel = getDifficultyLevel(difficultyLevelId).name
      return <div>{difficultyLevel}</div>
    },
  },
]

export function CreateAssessmentMain({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-many-quizzes?showAll=true`,
    fetcher,
  )
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [candidateEmails, setCandidateEmails] = useState([])
  const [selectedQuizzes, setSelectedQuizzes] = useState<IQuizDataProps[] | []>(
    [],
  )
  const userRoleURLSegment = pathname.split('/')[1]
  const form = useForm<z.infer<typeof formSchema>>({
    // TODO: type
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    const newSelectedQuizzes: IQuizDataProps[] = []

    for (const key in rowSelection) {
      const index = parseInt(key.split('/')[1])
      newSelectedQuizzes.push(data[index])
    }
    setSelectedQuizzes(newSelectedQuizzes)
  }, [rowSelection, data, setSelectedQuizzes])

  if (!data) {
    return <></>
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          details: data,
          quizzes: rowSelection,
          candidates: candidateEmails,
        }),
      })

      if (response.status === StatusCode.InternalServerError) {
        setIsLoading(false)
        return toast({
          title: 'Internal server error',
          description: 'Failed to create assessment.',
          variant: 'destructive',
        })
      }

      toast({
        title: 'You have successfully created an assessment.',
        description: 'Redirecting ...',
      })

      setTimeout(() => {
        router.push(`/${userRoleURLSegment}/assessments`)
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
            <h3 className='text-lg font-medium'>Basic Details</h3>
            <p className='text-sm text-muted-foreground'>
              Configure the basic configurations for your quiz.
            </p>
          </div>
          <Separator className='my-6' />
          <AssessmentDetails isLoading={isLoading} />
        </form>
      </Form>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Coding Quiz' />
          <QuizTableDialog
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          >
            <Button variant={'outline'}>Add</Button>
          </QuizTableDialog>
        </div>
        <Separator className='my-6' />
        <Card>
          <SelectedQuizTable
            setRowSelection={setRowSelection}
            rowSelection={rowSelection}
            selectedQuizzes={selectedQuizzes}
          />
        </Card>
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Candidates' />
          <AddCandidateDialog
            data={data}
            candidateEmails={candidateEmails}
            setCandidateEmails={setCandidateEmails}
          >
            <Button variant={'outline'}>Add</Button>
          </AddCandidateDialog>
        </div>
        <Separator className='my-6' />
        <Card>
          <CandidateEmailTable
            candidateEmails={candidateEmails}
            setCandidateEmails={setCandidateEmails}
          />
        </Card>
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

const re =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const emailFormSchema = z.object({
  email: z
    .string()
    .min(1, {message: 'Text area cannot be empty.'})
    .transform((string) => string.split(',').map((e) => e.trim()))
    .refine(
      (emailArray) => {
        if (!emailArray) {
          return false
        }
        const isValidEmail = emailArray.every((e) => re.test(e.trim()))
        return isValidEmail
      },
      (emailArray) => {
        if (!emailArray) {
          return {message: ''}
        }
        const invalidEmail = emailArray.filter(
          (e) => re.test(e.trim()) === false,
        )
        return {message: `Invalid email addresses: "${invalidEmail}"`}
      },
    ),
})

function AddCandidateDialog({
  children,
  candidateEmails,
  setCandidateEmails,
}: any) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof emailFormSchema>>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    resolver: zodResolver(emailFormSchema),
  })

  useEffect(() => {
    form.reset({email: candidateEmails.join(',')})
  }, [form, candidateEmails])

  const onSubmit = (value: z.infer<typeof emailFormSchema>) => {
    setCandidateEmails(value.email)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[30rem]'>
        <DialogHeader className='mb-16'>
          <DialogTitle>Add Candidates</DialogTitle>
          <DialogDescription>
            {`Use comma (,) to separate email addresses.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      onFocus={() => {
                        form.clearErrors()
                      }}
                      className='min-h-[160px]'
                      placeholder='Type email addresses here...'
                      {...field}
                    />
                  </FormControl>
                  <div className='h-16 w-96'>
                    <FormMessage className='line-clamp-3' />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function QuizTableDialog({children, data, rowSelection, setRowSelection}: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[90rem]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {`Make changes to your profile here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <DataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
