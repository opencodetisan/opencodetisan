'use client'

import {RecoverPasswordForm} from './recover-password-form'

export default function RecoverPassword() {
  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Recover password
        </h1>
        <p className='text-sm text-muted-foreground'>
          Choose your new password.
        </p>
      </div>
      <div className='w-96'>
        <RecoverPasswordForm />
      </div>
    </>
  )
}
