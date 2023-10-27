import {NextResponse} from 'next/server'
import {deleteQuizService, getQuizService} from '@/lib/core/service'
import {updateQuizDataService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {authOptions} from '../../auth/[...nextauth]/route'

export async function GET(request: Request, {params}: {params: {qid: string}}) {
  try {
    const qid = params.qid
    const quiz = await getQuizService({quizId: qid})

    return NextResponse.json({data: quiz})
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}

export async function PUT(request: Request, {params}: {params: {qid: string}}) {
  try {
    const session = await getServerSession(authOptions)
    const userId: string | undefined = session?.user.id
    const qid = params.qid
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
        id: qid,
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

export async function DELETE(
  request: Request,
  {params}: {params: {qid: string}},
) {
  try {
    const qid = params.qid

    deleteQuizService({quizId: qid})

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
