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
          name='codeLanguageId'
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
                  <SelectItem value='1'>Javascript</SelectItem>
                  <SelectItem value='2'>Python</SelectItem>
                  <SelectItem value='3'>C#</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='difficultyLevelId'
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
                  <SelectItem value='1'>Easy</SelectItem>
                  <SelectItem value='2'>Medium</SelectItem>
                  <SelectItem value='3'>Hard</SelectItem>
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
