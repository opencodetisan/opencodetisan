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
import MDEditor from '@uiw/react-md-editor'
import {useState} from 'react'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'

function RowData({name, value}: {name: string; value: string}) {
  return (
    <div className='flex items-center space-x-10'>
      <p className='self-start w-32 text-sm text-muted-foreground'>{name}</p>
      <p className='w-96 border line-clamp-2'>{value}</p>
    </div>
  )
}
const codeLanguageId = 1

export default function MainComponent({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [instruction, setInstruction] = useState('')
  const [solution, setSolution] = useState('')
  const [testRunner, setTestRunner] = useState('')
  const basicConfig = ['Title', 'Code Language', 'Difficulty Level']
  const basicConfigComponent = basicConfig.map((name: string) => {
    return (
      <RowData
        name={name}
        value={
          'eeeeeeee eeeeeeeeeee eeeeeeeee eeeeeee eeeeeeee eeee eeeeeeeee eeeeeee eeeeee eeeeee eeeeee eeeeeeeeee eeeeeeee eeeeee eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        }
      />
    )
  })

  return (
    <div className='space-y-6 w-2/4'>
      <Card className=''>
        <CardHeader></CardHeader>
        <CardContent className='space-y-2'>{basicConfigComponent}</CardContent>
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
