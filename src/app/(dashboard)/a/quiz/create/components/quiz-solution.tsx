import {CodeEditor} from '@/components/ui/code-editor'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {useContext} from 'react'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'
import {CodeEditorContext} from './context'
import {useFormContext} from 'react-hook-form'
import {Card, CardHeader} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'

export function QuizSolution({
  className,
  title,
  solution,
  setSolution,
  testRunner,
  setTestRunner,
  // codeLanguage,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {codeLanguage} = useContext(CodeEditorContext)
  const form = useFormContext()

  return (
    <Tabs defaultValue='solution' className=''>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='solution'>Solution</TabsTrigger>
        <TabsTrigger value='testcase'>Test Cases</TabsTrigger>
      </TabsList>
      <TabsContent
        value='solution'
        className='bg-white p-1 border rounded-md shadow-sm'
      >
        <ReflexContainer style={{height: '400px'}} orientation='vertical'>
          <ReflexElement className='left-pane'>
            <div className='pane-content'>
              <p className='text-xs'>Solution</p>
              <CodeEditor
                value={solution}
                onChange={setSolution}
                codeLanguageId={codeLanguage}
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
                codeLanguageId={codeLanguage}
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
          <CardHeader className='space-y-6 w-2/3'>
            <FormField
              control={form.control}
              name='input1'
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    <p className='text-sm text-muted-foreground'>Input 1</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='input2'
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    <p className='text-sm text-muted-foreground'>Input 2</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='output1'
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    <p className='text-sm text-muted-foreground'>Output 1</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='output2'
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    <p className='text-sm text-muted-foreground'>Output 2</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
