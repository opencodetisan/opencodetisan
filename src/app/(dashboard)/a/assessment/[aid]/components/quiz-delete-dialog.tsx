import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Icons} from '@/components/ui/icons'
import {Input} from '@/components/ui/input'
import {toast} from '@/components/ui/use-toast'
import {StatusCode} from '@/enums'
import {useParams, usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function QuizDeleteDialog({children, title}: any) {
  const router = useRouter()
  const pathname = usePathname()
  const userRoleURLSegment = pathname.split('/')[1]
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [input, setInput] = useState('')
  const param = useParams()

  useEffect(() => {
    if (input === title) {
      setIsDisabled(false)
    } else if (!isDisabled) {
      setIsDisabled(true)
    }
  }, [title, input, isDisabled])

  const onSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/assessment/${param.aid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to delete assessment.',
          variant: 'destructive',
        })
      }

      toast({
        title: 'Assessment successfully deleted.',
        description: 'Redirecting...',
      })

      setTimeout(() => {
        router.push(`/${userRoleURLSegment}/assessments`)
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete assessment</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            assessment?
          </DialogDescription>
        </DialogHeader>
        <div className='text-center my-4'>
          <p className='font-medium text-xl'>{title}</p>
        </div>
        <DialogFooter className=''>
          <div className='w-full flex flex-col sm:justify-center space-y-2'>
            <DialogDescription>
              {`To confirm, type "${title}" in the input box below`}
            </DialogDescription>
            <Input
              className='h-8'
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type='submit'
              className='h-8'
              disabled={isDisabled || isLoading}
              variant={'destructive'}
              onClick={() => {
                onSubmit()
              }}
            >
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Delete this assessment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
