import {addAssessmentCandidateService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {newCandidateEmails, assessmentId} = req

    await addAssessmentCandidateService({
      candidateEmails: newCandidateEmails,
      assessmentId,
    })
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
