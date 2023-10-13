import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {DataTable} from '@/components/ui/data-table'
import {fetcher} from '@/lib/fetcher'
import {cn, getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import {ColumnDef} from '@tanstack/react-table'
import {ArrowUpDown} from 'lucide-react'
import {useState} from 'react'
import useSWR from 'swr'

type IQuiz = {
  id: string
  title: string
  codeLanguageId: number
  difficultyLevelId: number
}

export const columns: ColumnDef<IQuiz>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'codeLangugage',
    header: 'Code Language',
    cell: ({row}) => {
      const codeLanguageId = row.getValue('codeLangugageId')
      const codeLanguage = getCodeLanguage(codeLanguageId).pretty
      return <div>{codeLanguage}</div>
    },
  },
  {
    accessorKey: 'difficultyLevel',
    header: 'Difficulty Level',
    cell: ({row}) => {
      const difficultyLevelId = row.getValue('difficultyLevelId')
      const difficultyLevel = getDifficultyLevel(difficultyLevelId).name
      return <div>{difficultyLevel}</div>
    },
  },
]

export default function QuizTable({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [rowSelection, setRowSelection] = useState({})
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-many-quizzes?showAll=true`,
    fetcher,
  )
  if (!data) {
    return <></>
  }

  console.log(rowSelection)

  return (
    <div className={cn(className, 'space-y-16')}>
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  )
}
