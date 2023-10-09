'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {CodeEditor} from '@/components/ui/code-editor'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {fetcher} from '@/lib/fetcher'
import {getCodeLanguage, getDifficultyLevel} from '@/lib/utils'
import MDEditor from '@uiw/react-md-editor'
import {useParams} from 'next/navigation'
import {useState} from 'react'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'
import useSWR from 'swr'

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
    <div className='space-y-6 w-2/4'>
      <Card className=''>
        <CardHeader></CardHeader>
        <CardContent className='space-y-2 text-sm'>
          <div className='flex items-center space-x-10'>
            <p className='flex-none self-start w-32 text-sm text-muted-foreground'>
              Title
            </p>
            <p className='w-96 line-clamp-2'>{quizData.title}</p>
          </div>
          <div className='flex items-center space-x-10'>
            <p className='flex-none self-start w-32 text-sm text-muted-foreground'>
              Code Language
            </p>
            <p className='w-96 line-clamp-2'>{codeLanguage}</p>
          </div>
          <div className='flex items-center space-x-10'>
            <p className='flex-none self-start w-32 text-sm text-muted-foreground'>
              Difficulty Level
            </p>
            <p className='line-clamp-2 w-full'>{difficultyLevel}</p>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <MDEditor
        className='border-white'
        height={400}
        data-color-mode='light'
        value={instruction}
        onChange={setInstruction}
        hideToolbar={true}
        preview='preview'
        {...props}
      />
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
                  value={solution}
                  onChange={setSolution}
                  codeLanguageId={codeLanguageId}
                  readOnly={true}
                />
              </div>
            </ReflexElement>
            <ReflexSplitter className='mx-1' />
            <ReflexElement className='right-pane'>
              <p className='text-xs'>Test runner</p>
              <div className='pane-content'>
                <CodeEditor
                  value={testRunner}
                  onChange={setTestRunner}
                  codeLanguageId={codeLanguageId}
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
  )
}
// <FormField
//   control={form.control}
//   name='input1'
//   render={({field}) => (
//     <FormItem>
//       <FormLabel>
//         <p className='text-sm text-muted-foreground'>Input 1</p>
//       </FormLabel>
//       <FormControl>
//         <Input {...field} />
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />
