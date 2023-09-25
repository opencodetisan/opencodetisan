import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'

import {Button} from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {useForm} from 'react-hook-form'
import {signIn} from 'next-auth/react'
import {useSearchParams} from 'next/navigation'
import {useState} from 'react'
import {Icons} from '@/components/ui/icons'
import {toast} from '@/components/ui/use-toast'

interface IEmailFormProps {
  setIsExecuted: (value: boolean) => void
}

const formSchema = z.object({
  username: z.string().email({message: 'Invalid email address'}),
})

export function EmailForm({setIsExecuted}: IEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    // TODO fix type err
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      username: '',
    },
  })

  // TODO fix type err
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/password-recoverys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...values}),
      })

      if (response.ok) {
        setIsExecuted(true)
      }

      toast({
        title: 'Server error',
        description: 'Failed to recover password.',
      })
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Password recovery error: ${error.message}`)
      } else {
        console.log('Unexpected error', error)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-2 flex flex-col'
      >
        <FormField
          control={form.control}
          name='username'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  id='email'
                  placeholder='name@example.com'
                  type='email'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          Continue
        </Button>
      </form>
    </Form>
  )
}
