'use client'

import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {CodeEditor} from '@/components/ui/code-editor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {fetcher} from '@/lib/fetcher'
import {cn, getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import MDEditor from '@uiw/react-md-editor'
import {useParams} from 'next/navigation'
import {useState} from 'react'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'
import useSWR from 'swr'

export function SectionHeader({
  title,
  subTitle,
}: {
  title: string
  subTitle?: string
}) {
  return (
    <>
      <h3 className='text-lg font-medium'>{title}</h3>
      {subTitle && <p className='text-sm text-muted-foreground'>{subTitle}</p>}
    </>
  )
}

function RowData({
  name,
  value,
  className,
}: {
  name: string
  value: string
  className?: any
}) {
  return (
    <div className={cn(className, 'flex items-center space-x-10')}>
      <p className='flex-none self-start w-32 text-sm text-muted-foreground'>
        {name}
      </p>
      <p className='w-96 line-clamp-2'>{value}</p>
    </div>
  )
}

export default function MainComponent({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const param = useParams()
  const {data} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/${param.qid}`,
    fetcher,
  )
  const [instruction, setInstruction] = useState('')
  const [solution, setSolution] = useState('')
  const [testRunner, setTestRunner] = useState('')

  if (!data) {
    return <></>
  }

  const {quizData, quizSolution, quizTestCase} = data.data
  const codeLanguage = getCodeLanguage(quizData.codeLanguageId).pretty
  const difficultyLevel = getDifficultyLevel(quizData.difficultyLevelId).name

  return (
    <div className='space-y-16 w-2/4'>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Basic Configuration' />
          <BasicConfigurationDialog>
            <Button variant={'outline'}>Edit</Button>
          </BasicConfigurationDialog>
        </div>
        <Separator className='my-6' />
        <Card className=''>
          <CardHeader></CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <RowData name={'Title'} value={quizData.title} />
            <RowData name={'Code langugage'} value={codeLanguage} />
            <RowData name={'Difficulty level'} value={difficultyLevel} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Instruction' />
          <Button variant={'outline'}>Edit</Button>
        </div>
        <Separator className='my-6' />
        <MDEditor
          className='border-white'
          height={400}
          data-color-mode='light'
          value={quizData.instruction}
          onChange={setInstruction}
          hideToolbar={true}
          preview='preview'
          {...props}
        />
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <SectionHeader title='Solution' />
          <Button variant={'outline'}>Edit</Button>
        </div>
        <Separator className='my-6' />
        <Tabs defaultValue='solution' className=''>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='solution'>Solution</TabsTrigger>
            <TabsTrigger value='testcase'>Test Cases</TabsTrigger>
          </TabsList>
          <TabsContent
            value='solution'
            className='bg-white p-1 border rounded-md shadow-sm'
            style={{height: '55vh'}}
          >
            <ReflexContainer orientation='vertical'>
              <ReflexElement className='left-pane'>
                <div className='pane-content'>
                  <p className='text-xs'>Solution</p>
                  <CodeEditor
                    value={quizSolution[0].code}
                    onChange={setSolution}
                    codeLanguageId={quizData.codeLanguageId}
                    readOnly={true}
                  />
                </div>
              </ReflexElement>
              <ReflexSplitter className='mx-1' />
              <ReflexElement className='right-pane'>
                <p className='text-xs'>Test runner</p>
                <div className='pane-content'>
                  <CodeEditor
                    value={quizSolution[0].testRunner}
                    onChange={setTestRunner}
                    codeLanguageId={quizData.codeLanguageId}
                    readOnly={true}
                  />
                </div>
              </ReflexElement>
            </ReflexContainer>
          </TabsContent>
          <TabsContent value='testcase'>
            <Card
              className='flex justify-center items-center h-[50vh]'
              style={{height: '50vh'}}
            >
              <CardHeader className='space-y-6 w-2/3'></CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function BasicConfigurationDialog({children}: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
