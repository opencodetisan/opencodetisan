import prisma from '@/lib/db/client'
import {NextResponse} from 'next/server'

export async function DELETE(request: Request) {
  try {
    const req = await request.json()
    const {assessmentId, candidateId} = req

    // TODO
    // use service function
    const assessmentCandidate = await prisma.assessmentCandidate.delete({
      where: {
        assessmentId_candidateId: {candidateId, assessmentId},
      },
    })
    return NextResponse.json({})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
