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
import {signIn, useSession} from 'next-auth/react'
import {useRouter, useSearchParams} from 'next/navigation'
import {getRoleURLSegment} from '@/lib/utils'

const formSchema = z.object({
  username: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(4, {message: 'Invalid password'}),
})

export function SignInForm() {
  const {data} = useSession()
  const role = data?.user?.role
  const roleURLSegment = getRoleURLSegment(role!)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/auth-redirect'
  const router = useRouter()

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
    e.preventDefault()
    signIn('credentials', {callbackUrl, ...values})
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
                <Input placeholder='Email Address' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
