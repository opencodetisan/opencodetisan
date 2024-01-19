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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {CheckCircle2, XCircle} from 'lucide-react'
import {toast} from '@/components/ui/use-toast'
import {Icons} from '@/components/ui/icons'
import {Button} from '@/components/ui/button'
import {LOADING, RUN} from '@/lib/constant'
import {Badge} from '@/components/ui/badge'

import {getCodeLanguage} from '@/lib/utils'

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
  isLoading,
  setIsLoading,
  output,
  setOutput,
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

  useEffect(() => {
    setOutput(undefined);
  }, [testRunner, solution]);

  async function runCode() {
    setIsLoading(true)
    setOutput(LOADING)

    try {
      const response = await fetch(
        '/api/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            solution,
            testRunner,
            language: getCodeLanguage(parseInt(codeLanguage, 10)).lang,
          }),
        },
      )

      if (!response.ok) {
        setIsLoading(false)
        return toast({
          title: 'Server error',
          description: 'Failed to run your solution.',
          variant: 'destructive',
        })
      }

      const json = await response.json()
      setOutput(json)
      setIsLoading(false)
    } catch (error) {
      console.log('Unexpected error', error)
    }
  }

  let outputContent = <><div className='flex items-center space-x-2'><p className=''>Result:</p></div></>

  if (output?.actual) {
    outputContent = (
      <>
        <div className='flex items-center space-x-2'>
          <p className='pl-4'>Result:</p>
          {output.result === true && (
            <Badge className='bg-green-600'>Success</Badge>
          )}
          {output.result === false && (
            <Badge className='bg-red-600'>Fail</Badge>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Expected Output</TableHead>
              <TableHead>Actual Output</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Test 1</TableCell>
              <TableCell>{output.expected[0]}</TableCell>
              <TableCell>{output.actual[0]}</TableCell>
              <TableCell>
                {output.status[0] ? (
                  <CheckCircle2 color='#2ec27e' />
                ) : (
                  <XCircle color='#c01c28' />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Test 2</TableCell>
              <TableCell>{output.expected[1]}</TableCell>
              <TableCell>{output.actual[1]}</TableCell>
              <TableCell>
                {output.status[1] ? (
                  <CheckCircle2 color='#2ec27e' />
                ) : (
                  <XCircle color='#c01c28' />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    )
  } else if (output?.message) {
    outputContent = (
      <>
        <div className='flex items-center space-x-2'>
          <p>Result:</p>
          <Badge className='bg-red-600'>Fail</Badge>
        </div>
        <pre className='text-red-500'>{output?.message}</pre>
      </>
    )
  } else if (output === LOADING) {
    outputContent = <p>Running...<Icons.spinner className='mr-2 h-4 w-4 animate-spin' /></p>
  }

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
        className='bg-white p-1 border rounded-md shadow-sm h-fit'
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
        <ReflexContainer orientation='horizontal'>
          <ReflexSplitter className='mb-4' style={{ pointerEvents: 'none' }}/>
          <ReflexElement className='left-pane px-2'>
            <div className='h-[200px]'>
              {outputContent}
            </div>
          </ReflexElement>
          <ReflexSplitter className='mb-2' style={{ pointerEvents: 'none' }}/>
          <ReflexElement className='right-pane px-2' style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button onClick={runCode} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Run
            </Button>
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
