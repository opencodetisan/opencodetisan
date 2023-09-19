'use client'

import '../../globals.css'
import {SignInForm} from './signin-form'

export default function SignIn() {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-96'>
        <SignInForm />
      </div>
    </div>
  )
}
