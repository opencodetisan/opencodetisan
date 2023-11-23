import {Button} from '@/components/ui/button'
import {DataTable} from '@/components/ui/data-table'
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
import {DialogClose} from '@radix-ui/react-dialog'
import {useState} from 'react'
import EditTooltip from './edit-tooltip'

export function QuizTableDialog({
  children,
  data,
  columns,
  addAssessmentQuiz,
  disabled,
}: any) {
  const [isLoading, setIsLoading] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const isData = data && data[0]

  const onSubmit = async () => {
    setIsLoading(true)
    await addAssessmentQuiz({rowSelection})
    setRowSelection({})
    setIsLoading(false)
  }

  if (disabled) {
    return (
      <EditTooltip>
        <div>{children}</div>
      </EditTooltip>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!isData}>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[90rem]'>
        <DialogHeader>
          <DialogTitle>Add quizzes</DialogTitle>
          <DialogDescription>{``}</DialogDescription>
        </DialogHeader>
        <DataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} onClick={onSubmit}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
