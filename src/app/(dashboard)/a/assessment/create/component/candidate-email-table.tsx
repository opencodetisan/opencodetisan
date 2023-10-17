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

export default function CandidateEmailTable({
  className,
  title,
  candidateEmails,
  setCandidateEmails,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const tableRowContent = candidateEmails.map(
    (email: string, index: number) => {
      const onRemove = () => {
        const newCandidateEmails = [...candidateEmails]
        newCandidateEmails.splice(index, 1)
        setCandidateEmails(newCandidateEmails)
      }
      return (
        <TableRow key={email}>
          <TableCell className='font-medium'>{email}</TableCell>
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
        {candidateEmails[0] && (
          <TableCaption className='mb-3'>
            A list of your candidate email addresses.
          </TableCaption>
        )}
        {!candidateEmails[0] && (
          <TableCaption className='mb-3'>{`Click 'Add' button to insert candidate email addresses.`}</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Email address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableRowContent}</TableBody>
      </Table>
    </div>
  )
}
