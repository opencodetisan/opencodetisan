'use client'

import {Button} from '@/components/ui/button'
import {Card, CardHeader} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Icons} from '@/components/ui/icons'
import {Input} from '@/components/ui/input'
import {toast} from '@/components/ui/use-toast'
import {StatusCode} from '@/enums'
import {zodResolver} from '@hookform/resolvers/zod'
import {useParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'

const formSchema = z.object({
  title: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
  description: z
    .string({required_error: 'Please type in quiz title'})
    .min(4, {message: 'Title must contain at least 4 character(s)'}),
})

export default function AssessmentDetailsDialog({
  children,
  mutate,
  title,
  description,
}: any) {
  const [isLoading, setIsLoading] = useState(false)
  const param = useParams()
  const form = useForm<z.infer<typeof formSchema>>({
    // TODO: type
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    form.reset({
      title,
      description,
    })
  }, [form, title, description])

  // TODO: type
  const onSubmit = async (data: any) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/update-assessment-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: param.aid}),
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
          <DialogTitle>Edit Assessment details</DialogTitle>
          <DialogDescription>
            {`Make changes to your assessment details here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader className='space-y-8'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-2 flex flex-col'
              >
                <FormField
                  control={form.control}
                  name='title'
                  disabled={isLoading}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  disabled={isLoading}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardHeader>
        </Card>
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
