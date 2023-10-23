import {NextResponse} from 'next/server'
import {getAssessmentService} from '@/lib/core/service'

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
