import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'
import {getManyAssessmentService} from '@/lib/core/service'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id!
  const assessments = await getManyAssessmentService({userId})

  return NextResponse.json(assessments)
}
