import {addAssessmentCandidateService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(
  request: Request,
  {params}: {params: {aid: string}},
) {
  try {
    const assessmentId = params.aid
    const req = await request.json()
    const {newCandidateEmails} = req

    await addAssessmentCandidateService({newCandidateEmails, assessmentId})
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
