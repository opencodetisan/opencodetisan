import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'
import {createQuizService} from '@/lib/core/service'
import {getManyQuizService, getQuizService} from '@/lib/core/service'

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId: string | undefined = session?.user.id as string
    const {
      title,
      codeLanguageId,
      difficultyLevelId,
      input1,
      input2,
      output1,
      output2,
      instruction,
      solution,
      testRunner,
    } = await request.json()

    // TODO: unwanted fields
    const quizData = {
      userId,
      title,
      answer: 'answer',
      locale: 'en',
      defaultCode: 'yeet',
      instruction,
      codeLanguageId: parseInt(codeLanguageId),
      difficultyLevelId: parseInt(difficultyLevelId),
    }

    // TODO: hardcoded sequence
    const quizSolution = [
      {
        code: solution,
        sequence: 0,
        testRunner,
        importDirectives: 'im',
      },
    ]

    // TODO: scalability
    const quizTestCases = [
      [
        {input: input1, output: output1},
        {input: input2, output: output2},
      ],
    ]

    const quiz = await createQuizService({
      quizData,
      quizTestCases,
      quizSolution,
    })

    return NextResponse.json({})
  } catch (error) {
    console.log(error)
  }
}
