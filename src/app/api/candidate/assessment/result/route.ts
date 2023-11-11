import {createCandidateQuizAttempt} from '@/lib/core/candidate'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const {assessmentResultId} = await request.json()

    await createCandidateQuizAttempt({assessmentResultId})

    return NextResponse.json({data: {}})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
