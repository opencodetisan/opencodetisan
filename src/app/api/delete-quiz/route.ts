import {deleteQuizService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const req = await request.json()
    const {quizId} = req

    deleteQuizService({quizId})

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
