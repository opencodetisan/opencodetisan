import {addAssessmentCandidateService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {newCandidateInfo, assessmentId} = req

    await addAssessmentCandidateService({
      candidateInfo: newCandidateInfo,
      assessmentId,
    })
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
