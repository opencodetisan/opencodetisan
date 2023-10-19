import {updateAssessmentDataService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function PUT(request: Request) {
  try {
    const {title, description, id} = await request.json()

    const assessment = await updateAssessmentDataService({
      title,
      description,
      assessmentId: id,
    })

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
