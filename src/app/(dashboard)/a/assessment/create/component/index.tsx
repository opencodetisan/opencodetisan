'use client'

import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from '@/components/ui/use-toast'
import {Form} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {StatusCode} from '@/enums'
import {usePathname, useRouter} from 'next/navigation'
import {Icons} from '@/components/ui/icons'
import {AssessmentDetails} from './assessment-details'
import {useState} from 'react'

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  description: z.string(),
})

export function CreateAssessmentMain({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter()
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    // TODO: type
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data}),
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
    </div>
  )
}
