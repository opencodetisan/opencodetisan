import {updateQuizDataService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId: string | undefined = session?.user.id

    if (!userId) {
      return NextResponse.json({
        statusCode: 401,
        message: 'Unauthorized access',
      })
    }

    const req = await request.json()

    const difficultyLevelId = req.difficultyLevelId
      ? parseInt(req.difficultyLevelId)
      : undefined
    const codeLanguageId = req.codeLanguageId
      ? parseInt(req.codeLanguageId)
      : undefined

    const result = await updateQuizDataService({
      quizData: {
        ...req,
        difficultyLevelId,
        codeLanguageId,
        userId,
      },
    })

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
