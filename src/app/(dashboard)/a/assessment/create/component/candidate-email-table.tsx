import {Button} from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {cn} from '@/lib/utils'
import {SetStateAction} from 'react'

export default function CandidateEmailTable({
  className,
  title,
  candidateInfo,
  setCandidateInfo,
  ...props
}: {
  className?: React.HTMLAttributes<HTMLElement>
  title?: string
  candidateInfo: string[]
  setCandidateInfo: (value: SetStateAction<string[]>) => void
}) {
  const tableRowContent = candidateInfo.map(
    (info: string, index: number) => {
      const [name, email, remarks] = info.split(',')

      const onRemove = () => {
        const newCandidateInfo = [...candidateInfo]
        newCandidateInfo.splice(index, 1)
        setCandidateInfo(newCandidateInfo)
      }
      
      return (
        <TableRow key={email}>
          <TableCell className='font-medium'>{name}</TableCell>
          <TableCell className='font-medium'>{email}</TableCell>
          <TableCell className='font-medium'>{remarks}</TableCell>
          <TableCell className='text-right'>
            <Button variant={'destructive'} className='h-8' onClick={onRemove}>
              Remove
            </Button>
          </TableCell>
        </TableRow>
      )
    },
  )

  return (
    <div className={cn(className)}>
      <Table>
        {candidateInfo[0] && (
          <TableCaption className='mb-3'>
            A list of your candidate details.
          </TableCaption>
        )}
        {!candidateInfo[0] && (
          <TableCaption className='mb-3'>{`Click 'Add' button to insert candidate email addresses.`}</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email address</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableRowContent}</TableBody>
      </Table>
    </div>
  )
}
