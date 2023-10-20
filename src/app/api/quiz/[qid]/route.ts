import {NextResponse} from 'next/server'
import {getQuizService} from '@/lib/core/service'

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
