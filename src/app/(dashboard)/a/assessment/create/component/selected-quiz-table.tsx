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
import {cn, getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import {IQuizDataProps} from '@/types'

// TODO: type
interface ISelectedQuizTableProps {
  className: React.HTMLAttributes<HTMLElement>
  rowSelection: Record<number, boolean>
  setRowSelection: any
  selectedQuizzes: any[]
}

export default function SelectedQuizTable({
  className,
  rowSelection,
  setRowSelection,
  selectedQuizzes,
}: ISelectedQuizTableProps) {
  const tableRowContent = selectedQuizzes?.map(
    (selectedQuiz: IQuizDataProps) => {
      if (!selectedQuiz) {
        return <></>
      }
      const codeLanguage = getCodeLanguage(selectedQuiz.codeLanguageId).pretty
      const difficultyLevel = getDifficultyLevel(
        selectedQuiz.difficultyLevelId,
      ).name
      const onRemove = () => {
        const newRowSelection = {...rowSelection}
        Object.keys(newRowSelection).forEach((key) => {
          key.indexOf(selectedQuiz.id) == 0 && delete newRowSelection[key]
        })
        setRowSelection(newRowSelection)
      }
      return (
        <TableRow key={selectedQuiz.id}>
          <TableCell className='font-medium'>{selectedQuiz.title}</TableCell>
          <TableCell>{codeLanguage}</TableCell>
          <TableCell>{difficultyLevel}</TableCell>
          <TableCell className='w-[100px] text-right'>
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
        {selectedQuizzes[0] && (
          <TableCaption className='mb-3'>
            A list of your selected quizzes.
          </TableCaption>
        )}
        {!selectedQuizzes[0] && (
          <TableCaption className='mb-3'>{`Click 'Add' button to select coding quizzes.`}</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Code Language</TableHead>
            <TableHead>Difficulty Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableRowContent}</TableBody>
      </Table>
    </div>
  )
}
