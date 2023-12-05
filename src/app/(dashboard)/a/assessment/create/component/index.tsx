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
import EditTooltip from '../../[aid]/components/edit-tooltip'

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
      const codeLanguageId = row.original.codeLanguageId
      const codeLanguage = getCodeLanguage(codeLanguageId as number).pretty
      return <div>{codeLanguage}</div>
    },
  },
  {
    accessorKey: 'difficultyLevel',
    header: 'Difficulty Level',
    cell: ({row}) => {
      const difficultyLevelId = row.original.difficultyLevelId
      const difficultyLevel = getDifficultyLevel(
        difficultyLevelId as number,
      ).name
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
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz?showAll=true`,
    fetcher,
  )
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [candidateInfo, setCandidateInfo] = useState<string[]>([])
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
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          details: data,
          quizzes: rowSelection,
          candidates: candidateInfo,
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
          <SectionHeader title='Coding Quizzes' />
          <QuizTableDialog
            data={data}
            columns={columns}
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
            candidateInfo={candidateInfo}
            setCandidateInfo={setCandidateInfo}
          >
            <Button variant={'outline'}>Add</Button>
          </AddCandidateDialog>
        </div>
        <Separator className='my-6' />
        <Card>
          <CandidateEmailTable
            candidateInfo={candidateInfo}
            setCandidateInfo={setCandidateInfo}
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

const validCandidateFormat = /^([^,]+),([^@]+@[^,]+\.[^,]+),([^]+)$/;

const candidateFormSchema = z.object({
  email: z
    .string()
    .min(1, {message: 'Text area cannot be empty.'})
    .transform((string) => string.split('\n').map((e) => e.trim()))
    .refine(
      (detailsArray) => {
        if (!detailsArray) {
          return false
        }
        const isValidCandidate = detailsArray.every((e) => validCandidateFormat.test(e.trim()))
        return isValidCandidate
      },
      (detailsArray) => {
        if (!detailsArray) {
          return {message: ''}
        }
        const invalidDetails = detailsArray.filter(
          (e) => validCandidateFormat.test(e.trim()) === false,
        )
        return {message: `Invalid candidate details: "${invalidDetails}"`}
      },
    ),
})

export function AddCandidateDialog({
  children,
  candidateInfo,
  setCandidateInfo,
  addCandidates, // TODO: type
  disabled,
}: any) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof candidateFormSchema>>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    // TODO
    // @ts-ignore
    resolver: zodResolver(candidateFormSchema),
  })

  useEffect(() => {
    form.reset({email: (candidateInfo ?? []).join('\n')})
  }, [form, candidateInfo])

  const onSubmit = async (value: z.infer<typeof candidateFormSchema>) => {
    setIsLoading(true)
    setCandidateInfo(value.email)
    if (addCandidates) {
      await addCandidates(value.email)
    }
    setIsLoading(false)
    setOpen(false)
  }

  if (disabled) {
    return (
      <EditTooltip>
        <div>{children}</div>
      </EditTooltip>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[30rem] h-5/6'>
        <DialogHeader className='mb-2'>
          <DialogTitle>Add Candidates</DialogTitle>
          <DialogDescription>
            <p>
              Each line represent one candidate. <br />Use comma (,) to separate name, email address, remarks
              <br />*Remarks : Should not contains commas(','). Use a dash('-') if there are no remarks.
            </p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='email'
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      onFocus={() => {
                        form.clearErrors()
                      }}
                      className='h-[55vh] max-h-[55vh]'
                      placeholder='Type candidate details here...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function QuizTableDialog({
  children,
  data,
  rowSelection,
  setRowSelection,
  columns,
}: any) {
  const isData = data && data[0]
  return (
    <Dialog>
      <DialogTrigger asChild disabled={!isData}>
        {children}
      </DialogTrigger>
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
