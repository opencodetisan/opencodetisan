import {Separator} from '@/components/ui/separator'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <div className=''>
      <div className='py-12 mx-72'>
        <h2 className='text-3xl tracking-tight'>Quizzes</h2>
      </div>
      <Separator />
      {children}
    </div>
  )
}
