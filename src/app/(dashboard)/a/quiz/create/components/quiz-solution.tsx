import {CodeEditor} from '@/components/ui/code-editor'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {useContext, useEffect, useState} from 'react'
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
  hasTabChanged,
  setHasTabChanged,
  ...props // TODO: type
}: any) {
  const {codeLanguage} = useContext(CodeEditorContext)
  const form = useFormContext()
  const [tabValue, setTabValue] = useState<'solution' | 'testcase'>('solution')
  const solutionValues = form.watch(['input1', 'input2', 'output1', 'output1'])

  useEffect(() => {
    const isValidSolutions = solutionValues.some((v) => v.trim() === '')
    if (isValidSolutions && !hasTabChanged) {
      setTabValue('testcase')
      setHasTabChanged(true)
    }
  }, [solutionValues])

  return (
    <Tabs defaultValue='solution' value={tabValue}>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='solution' onClick={() => setTabValue('solution')}>
          Solution
        </TabsTrigger>
        <TabsTrigger value='testcase' onClick={() => setTabValue('testcase')}>
          Test Cases
        </TabsTrigger>
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

export function QuizTestCaseForm() {
  const form = useFormContext()

  return (
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
  )
}
