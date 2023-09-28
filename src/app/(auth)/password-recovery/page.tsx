'use client'

import {EmailForm} from './email-form'
import {useState} from 'react'

export default function PasswordRecovery() {
  const [isExecuted, setIsExecuted] = useState(false)

  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        {!isExecuted && (
          <>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Password recovery
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email below to recover your account.
            </p>
          </>
        )}
        {isExecuted && (
          <>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Check your Email
            </h1>
            <p className='text-sm text-muted-foreground'>
              A password recovery email has been sent to your email address.
            </p>
          </>
        )}
      </div>
      <div className='w-96'>
        {!isExecuted && <EmailForm setIsExecuted={setIsExecuted} />}
      </div>
    </>
  )
}
