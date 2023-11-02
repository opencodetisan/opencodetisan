import {NextResponse} from 'next/server'
import {deleteAssessmentService, getAssessmentService} from '@/lib/core/service'
import {updateAssessmentDataService} from '@/lib/core/service'

export async function PUT(request: Request, {params}: {params: {aid: string}}) {
  try {
    const aid = params.aid
    const {title, description} = await request.json()

    const assessment = await updateAssessmentDataService({
      title,
      description,
      assessmentId: aid,
    })

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}

export async function GET(request: Request, {params}: {params: {aid: string}}) {
  try {
    const aid = params.aid
    const assessment = await getAssessmentService({assessmentId: aid})

    return NextResponse.json({data: assessment})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}

export async function DELETE(
  request: Request,
  {params}: {params: {aid: string}},
) {
  try {
    const aid = params.aid

    deleteAssessmentService({assessmentId: aid})

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
