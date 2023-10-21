import {getServerSession} from 'next-auth'
import {NextResponse} from 'next/server'
import {authOptions} from '../auth/[...nextauth]/route'
import {
  acceptAssessmentService,
  createAssessmentService,
  getManyAssessmentService,
} from '@/lib/core/service'
import {inspect} from 'util'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id!
  // const params = new URL(request.url).searchParams
  // const showAll = params.get('showAll') === 'true'

  // await createAssessmentService({
  //   userId,
  //   title: 'assessment',
  //   description: 'description',
  //   quizIds: ['ckps9y6qc0028emc805po1294', 'ckpsa1f580031gzc8j2j9eo4o'],
  // })

  // const inspectItem = (item: any) => {
  //   console.log(
  //     inspect(item, {
  //       showHidden: false,
  //       depth: null,
  //       colors: true,
  //     }),
  //   )
  // }
  const assessments = await getManyAssessmentService({userId})
  // inspectItem(assessments)

  return NextResponse.json(assessments)
}
