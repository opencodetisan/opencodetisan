import {deleteAssessmentCandidateService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function DELETE(request: Request) {
  try {
    const req = await request.json()
    const {assessmentId, candidateId} = req

    // TODO
    // assessmentCandidateEmail not needed?
    await deleteAssessmentCandidateService({candidateId, assessmentId})
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
