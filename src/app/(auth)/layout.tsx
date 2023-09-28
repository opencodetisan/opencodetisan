import {Toaster} from '@/components/ui/toaster'
import '../globals.css'
import NextAuthProvider from '../nextauth-provider'

export default function SignInLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body>
        <NextAuthProvider>
          <div className='min-h-screen flex justify-center items-center'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
              {children}
            </div>
          </div>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  )
}
