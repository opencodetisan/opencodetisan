import {CodeEditor} from '@/components/ui/code-editor'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'
import 'react-reflex/styles.css'

export function QuizSolution({
  className,
  title,
  solution,
  setSolution,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
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
              <CodeEditor value={solution} onChange={setSolution} />
            </div>
          </ReflexElement>
          <ReflexSplitter className='mx-1' />
          <ReflexElement className='right-pane'>
            <p className='text-xs'>Test runner</p>
            <div className='pane-content'>
              <CodeEditor />
            </div>
          </ReflexElement>
        </ReflexContainer>
      </TabsContent>
      <TabsContent value='testcase'></TabsContent>
    </Tabs>
  )
}
