import {NextResponse} from 'next/server'
import {deleteQuizService, getQuizService} from '@/lib/core/service'

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
