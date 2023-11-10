import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {getCandidateAssessmentService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'

export async function GET(request: Request, {params}: {params: {aid: string}}) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id as string
    const {aid} = params

    const candidateAssessment = await getCandidateAssessmentService({
      assessmentId: aid,
      candidateId: userId,
    })

    return NextResponse.json({data: candidateAssessment})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
