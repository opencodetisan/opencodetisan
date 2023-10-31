import {createAssessmentQuizService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {quizIds, assessmentId} = req
    await createAssessmentQuizService({quizIds, assessmentId})
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
