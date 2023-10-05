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
import {useState} from 'react'
import {Icons} from '@/components/ui/icons'
import {toast} from '@/components/ui/use-toast'
import {useRouter, useSearchParams} from 'next/navigation'
import {setTimeout} from 'timers'

const formSchema = z
  .object({
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({password, confirmPassword}, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

export function RecoverPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof formSchema>>({
    // TODO fix type err
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // TODO fix type err
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: values.password, token}),
      })

      if (!response.ok) {
        setIsLoading(false)
        return toast({
          title: 'Server error',
          description: 'Failed to recover password.',
          variant: 'destructive',
        })
      }

      toast({
        title: 'You have recovered your password.',
        description: 'Redirecting to sign-in page',
      })

      setTimeout(() => {
        router.push('/signin')
      }, 2000)
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
          disabled={isLoading}
          control={form.control}
          name='password'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  id='password'
                  type='password'
                  placeholder='New password'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='confirmPassword'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm password'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          Confirm
        </Button>
      </form>
    </Form>
  )
}
