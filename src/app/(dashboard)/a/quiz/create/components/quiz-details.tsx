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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {useFormContext} from 'react-hook-form'

export function QuizDetails({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const form = useFormContext()

  return (
    <Card>
      <CardHeader className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({field}) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='codeLanguage'
          render={({field}) => (
            <FormItem>
              <FormLabel>Code Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a code language' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='javascript'>Javascript</SelectItem>
                  <SelectItem value='python'>Python</SelectItem>
                  <SelectItem value='csharp'>C#</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='difficultyLevel'
          render={({field}) => (
            <FormItem>
              <FormLabel>Difficulty level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a difficulty level' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='easy'>Easy</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='hard'>Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardHeader>
    </Card>
  )
}
