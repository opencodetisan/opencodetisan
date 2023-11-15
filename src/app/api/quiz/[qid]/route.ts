import {NextResponse} from 'next/server'
import {deleteQuizService, getQuizService} from '@/lib/core/service'
import {updateQuizDataService} from '@/lib/core/service'
import {getServerSession} from 'next-auth'
import {authOptions} from '../../auth/[...nextauth]/route'
import Docker from 'dockerode'

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

    const docker = new Docker({
      socketPath: process.env.DOCKER_SOCKET_PATH,
    })
    const container = await docker.createContainer({
      OpenStdin: true,
      Image: 'javascript:yrn6kc5ic5vd1dy6dn0mphzg1hzmxhfl',
      Cmd: [],
      // HostConfig: {
      //   Privileged: true,
      // },
    })
    const started = await container.start()

    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
    })
    stream.write(
      '{"language": "javascript", "files": [{"name": "main", "content": "return (42)"}]}',
    )

    stream.pipe(process.stdout, {
      end: true,
    })

    stream.on('end', function () {})

    await container.stop()

    return NextResponse.json({})
  } catch (error) {
    console.log('Unexpected error: ', error)
    return NextResponse.json({})
  }
}
