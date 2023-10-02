import {Separator} from '@/components/ui/separator'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <div className=''>
      <div className='px-72 py-12 bg-white'>
        <h2 className='text-3xl tracking-tight'>Quizzes</h2>
      </div>
      <Separator />
      <div className='px-72 pt-6'>{children}</div>
    </div>
  )
}
