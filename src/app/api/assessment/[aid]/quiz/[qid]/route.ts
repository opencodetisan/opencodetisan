import {deleteAssessmentQuizService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function DELETE(
  request: Request,
  {params}: {params: {aid: string; qid: string}},
) {
  try {
    const {aid, qid} = params

    await deleteAssessmentQuizService({quizId: qid, assessmentId: aid})

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
