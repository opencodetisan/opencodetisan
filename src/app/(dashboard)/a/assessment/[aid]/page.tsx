'use client'
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {PageHeader} from '@/components/ui/page-header'
import {Separator} from '@/components/ui/separator'
import {RowData, SectionHeader} from '../../quiz/[qid]/components'
import AssessmentDetailsDialog from './components/assessment-details-dialog'
import {Button} from '@/components/ui/button'
import useSWR from 'swr'
import {fetcher} from '@/lib/fetcher'
import {useParams} from 'next/navigation'

export default function Assessment() {
  const param = useParams()
  const {data, mutate} = useSWR(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/assessment/${param.aid}`,
    fetcher,
  )
  if (!data) {
    return <></>
  }

  const assessmentDetails = data.data.data

  return (
    <div>
      <div className='flex justify-center py-12 bg-white'>
        <div className='w-2/4'>
          <PageHeader title='Assessments' />
        </div>
      </div>
      <Separator />
      <div className={`flex justify-center pt-6`}>
        <div className='space-y-16 w-2/4'>
          <div>
            <div className='flex justify-between items-center'>
              <SectionHeader title='Basic Configuration' />
              <AssessmentDetailsDialog
                mutate={mutate}
                title={assessmentDetails.title}
                description={assessmentDetails.description}
              >
                <Button variant={'outline'}>Edit</Button>
              </AssessmentDetailsDialog>
            </div>
            <Separator className='my-6' />
            <Card className=''>
              <CardHeader></CardHeader>
              <CardContent className='space-y-2 text-sm'>
                <RowData name={'Title'} value={assessmentDetails.title} />
                <RowData
                  name={'Description'}
                  value={assessmentDetails.description}
                />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
