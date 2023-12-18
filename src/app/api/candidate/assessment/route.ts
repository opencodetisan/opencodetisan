import {getServerSession} from 'next-auth'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {NextResponse} from 'next/server'
import {getManyCandidateAssessmentService} from '@/lib/core/service'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    //const userId = session?.user.id!
    const userId = null
    if (!userId) {
      throw Error('UserID not found')
    }
    const assessments = await getManyCandidateAssessmentService({ userId })

    return NextResponse.json(assessments)
  } catch (e) {
      console.log(e)
      return NextResponse.error()
  }
}