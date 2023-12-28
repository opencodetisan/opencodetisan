import {CodeEditor} from '@/components/ui/code-editor'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {useContext, useEffect, useState} from 'react'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'
import {CodeEditorContext} from './context'
import {Controller, useFormContext} from 'react-hook-form'
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
  solutionField,
  testRunnerField,
  solutionFieldState,
  testRunnerFieldState,
  ...props // TODO: type
}: any) {
  const {codeLanguage} = useContext(CodeEditorContext)
  const form = useFormContext()
  const [tabValue, setTabValue] = useState<'solution' | 'testcase'>('solution')
  const solutionValues = form.watch(['input1', 'input2', 'output1', 'output2'])

  useEffect(() => {
    const isValidSolutions = solutionValues.some((v) => v.trim() === '')
    if (isValidSolutions && !hasTabChanged) {   
      setTabValue('testcase')
      setHasTabChanged(true)
    } else if ((solutionFieldState?.error || testRunnerFieldState?.error) && !hasTabChanged) {
      setTabValue('solution')
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
        style={{height: '70vh'}}
      >
        <ReflexContainer orientation='vertical'>
          <ReflexElement className='left-pane'>
            <div className='pane-content'>
              <p className='text-sm text-muted-foreground'>Solution</p>
              <Controller
              name="solution"
              control={form.control}
              render={({field}) => (
                <CodeEditor
                value={solution}
                onChange={(value: string) => {
                  field.onChange(value)
                  setSolution(value)
                }}
                codeLanguageId={codeLanguage}
                />
              )}
              />
              <FormMessage>
                {solutionFieldState?.error && (
                  <span className='text-red-500'>{solutionFieldState.error.message}</span>
                )}
              </FormMessage>
            </div>
          </ReflexElement>
          <ReflexSplitter className='mx-1' />
          <ReflexElement className='right-pane'>
            <div className='pane-content'>
              <p className='text-sm text-muted-foreground'>Test Runner</p>
              <Controller
              name="testRunner"
              control={form.control}
              render={({field,fieldState}) => (
                <CodeEditor
                value={testRunner}
                onChange={(value: string) => {
                  field.onChange(value)
                  setTestRunner(value)
                }}
                codeLanguageId={codeLanguage}
                />
              )}
              />
              <FormMessage>
                {testRunnerFieldState?.error && (
                  <span className='text-red-500'>{testRunnerFieldState.error.message}</span>
                )}
              </FormMessage>
            </div>
          </ReflexElement>
        </ReflexContainer>
      </TabsContent>
      <TabsContent value='testcase'>
        <Card className='flex justify-center items-center h-[70vh] overflow-y-auto'>
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
