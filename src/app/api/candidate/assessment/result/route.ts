import {createCodingQuizAttemptService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const {assessmentResultId} = await request.json()

    const result = await createCodingQuizAttemptService({assessmentResultId})

    const assessmentQuizSubmissionId =
      result.assessmentResult.assessmentQuizSubmissions[0].id

    return NextResponse.json({data: {assessmentQuizSubmissionId}})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
