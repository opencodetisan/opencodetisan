'use client'

import {Card, CardHeader} from '@/components/ui/card'
import {DateTimePicker} from '@/components/ui/date-time-picker/date-time-picker'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {useFormContext} from 'react-hook-form'

export function AssessmentDetails({
  className,
  isLoading,
  ...props
}: {
  className?: React.HTMLAttributes<HTMLElement>
  isLoading: boolean
}) {
  const form = useFormContext()

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
          name='description'
          disabled={isLoading}
          render={({field}) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex space-x-4'>
          <FormField
            control={form.control}
            name='startAt'
            disabled={isLoading}
            render={({field}) => (
              <FormItem>
                <FormLabel>Starting date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    granularity={'minute'}
                    onChange={(date) => {
                      field.onChange(!!date ? date.toString() : null)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='endAt'
            disabled={isLoading}
            render={({field}) => (
              <FormItem>
                <FormLabel>Ending date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    granularity={'minute'}
                    onChange={(date) => {
                      field.onChange(!!date ? date.toString() : null)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardHeader>
    </Card>
  )
}
