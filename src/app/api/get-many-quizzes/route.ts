import {getManyQuizService, getQuizService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const userId: string | undefined = session?.user.id
  const params = new URL(request.url).searchParams
  const showAll = params.get('showAll') === 'true'

  const quizzes = await getManyQuizService({
    userId: showAll ? undefined : userId,
  })

  return NextResponse.json(quizzes)
}
