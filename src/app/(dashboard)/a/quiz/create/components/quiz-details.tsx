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
import {useEffect, useState} from 'react'
import {useFormContext} from 'react-hook-form'

export function QuizDetails({
  className,
  isLoading,
  ...props
}: {
  className?: React.HTMLAttributes<HTMLElement>
  isLoading: boolean
}) {
  const form = useFormContext()
  // const [codeLanguages, setCodeLanguages] = useState([])

  // useEffect(() => {
  //   const fetchCodeLanguages = async () => {
  //     try {
  //       const response = await fetch('your-api-endpoint-for-code-languages')
  //       const data = await response.json()
  //       setCodeLanguages(data)
  //     } catch (error) {
  //       console.error('Error fetching code languages')
  //     }
  //   }
  //   fetchCodeLanguages()
  // }, [])
  
  // let selectLanguageContent = <></>

  return (
    <Card>
      <CardHeader className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          disabled={isLoading}
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
          disabled={isLoading}
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
                  <SelectItem value='5'>C</SelectItem>
                  <SelectItem value='6'>C++</SelectItem>
                  <SelectItem value='7'>Java</SelectItem>
                  {/* {codeLanguages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.prettyName}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='difficultyLevelId'
          disabled={isLoading}
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
