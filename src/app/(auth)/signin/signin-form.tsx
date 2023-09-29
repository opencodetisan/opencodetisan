'use client'

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
import {useRouter, useSearchParams} from 'next/navigation'
import {Card, CardContent} from '@/components/ui/card'
import {ExclamationTriangleIcon} from '@radix-ui/react-icons'
import {useState} from 'react'
import {Icons} from '@/components/ui/icons'

const formSchema = z.object({
  username: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(4, {message: 'Invalid password'}),
})

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const isInvalidCredentials =
    searchParams.get('error') === 'CredentialsSignin' ?? false

  const form = useForm<z.infer<typeof formSchema>>({
    // TODO fix type err
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // TODO fix type err
  function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    setIsLoading(true)
    e.preventDefault()
    signIn('credentials', {callbackUrl: '/auth-redirect', ...values})
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
          name='username'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Email Address' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='password'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Password' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isInvalidCredentials && (
          <Card className='border-red-400 bg-red-50'>
            <CardContent className='flex space-x-2 items-center p-3 text-red-500 font-medium'>
              <ExclamationTriangleIcon />
              <p className='text-xs'>Incorrect email or password.</p>
            </CardContent>
          </Card>
        )}
        <div className='flex justify-end'>
          <Button
            className='pr-0 text-sm text-blue-500 font-normal'
            variant='link'
            type='button'
            onClick={() => {
              router.push('/password-recovery')
            }}
          >
            Forgot password?
          </Button>
        </div>
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          Submit
        </Button>
      </form>
    </Form>
  )
}
