import {deleteAssessmentCandidateService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function DELETE(
  request: Request,
  {params}: {params: {aid: string; cid: string}},
) {
  try {
    const {aid, cid} = params

    // TODO
    // assessmentCandidateEmail not needed?
    await deleteAssessmentCandidateService({
      candidateId: cid,
      assessmentId: aid,
    })
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
