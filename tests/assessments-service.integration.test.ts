import {getAssessment} from '@/lib/core/assessment'
import {
  acceptAssessmentService,
  createAssessmentService,
  getAssessmentService,
  getManyAssessmentService,
} from '@/lib/core/service'
import prisma from '@/lib/db/client'
import {faker} from '@faker-js/faker'
import {inspect} from 'node:util'

const createFakeQuizzes = async ({userId}: {userId: string}) => {
  const word = faker.lorem.word()
  const codeLanguageId = faker.number.int(1000)
  const difficultyLevelId = faker.number.int(1000)
  const createQuizPromises: Promise<any>[] = []

  await prisma.codeLanguage.create({data: {id: codeLanguageId, name: word}})
  await prisma.difficultyLevel.create({
    data: {id: difficultyLevelId, name: word},
  })

  for (let i = 0; i < 2; i++) {
    createQuizPromises.push(
      prisma.quiz.create({
        data: {
          title: word,
          userId,
          codeLanguageId,
          difficultyLevelId,
        },
      }),
    )
  }

  const quizzes = await Promise.all(createQuizPromises)

  return quizzes
}

const createFakeUsers = async () => {
  const promises: Promise<any>[] = []
  const uuids = [(faker.string.uuid(), faker.string.uuid())]
  uuids.forEach((id) => {
    const word = faker.lorem.word()
    promises.push(prisma.user.create({data: {id, name: word}}))
  })
  return Promise.all(promises)
}

describe('Integration test: Assessment', () => {
  describe('Integration test: createAssessmentService', () => {
    const uuid = faker.string.uuid()
    const word = faker.lorem.word()
    const userId = faker.string.uuid()
    const codeLanguageId = faker.number.int(1000)
    const difficultyLevelId = faker.number.int(1000)
    const quizId = faker.string.uuid()
    let quizzes: any[]

    let assessmentId: string

    beforeAll(async () => {
      const createQuizPromises: Promise<any>[] = []

      await prisma.user.create({data: {id: userId, name: word}})
      await prisma.codeLanguage.create({data: {id: codeLanguageId, name: word}})
      await prisma.difficultyLevel.create({
        data: {id: difficultyLevelId, name: word},
      })
      Array(2).forEach(() => {
        createQuizPromises.push(
          prisma.quiz.create({
            data: {
              id: quizId,
              title: word,
              userId,
              codeLanguageId,
              difficultyLevelId,
            },
          }),
        )
      })
      quizzes = await Promise.all(createQuizPromises)
    })

    afterAll(async () => {
      const deleteQuizPromises: Promise<any>[] = []

      await prisma.assessmentQuiz.deleteMany({where: {quizId}})
      await prisma.assessment.delete({where: {id: assessmentId}})
      quizzes.forEach((q) => {
        deleteQuizPromises.push(prisma.quiz.delete({where: {id: q.id}}))
      })
      await Promise.all(deleteQuizPromises)
      await prisma.codeLanguage.delete({where: {id: codeLanguageId}})
      await prisma.difficultyLevel.delete({where: {id: difficultyLevelId}})
      await prisma.user.delete({where: {id: userId}})
    })

    test('it should create a new assessment', async () => {
      const quizIds = quizzes.map((q) => q.id)
      const assessment = await createAssessmentService({
        userId,
        title: word,
        description: word,
        quizIds,
      })

      assessmentId = assessment.id
      const expectedAssessment = await getAssessment({assessmentId})

      expect(assessment).toEqual(expectedAssessment.data)
    })
  })

  describe('Integration test: getAssessmentService', () => {
    const word = faker.lorem.word()
    let createadAssessment: any

    beforeAll(async () => {
      await prisma.userAction.create({data: {id: 1, userAction: 'bankai'}})
      const users = await createFakeUsers()
      const quizzes = await createFakeQuizzes({userId: users[0].id})
      const quizIds = quizzes.map((q) => q.id)
      console.log(quizzes)

      createadAssessment = await createAssessmentService({
        userId: users[0].id,
        title: word,
        description: word,
        quizIds,
      })
      await acceptAssessmentService({
        assessmentId: createadAssessment.id,
        token: faker.string.uuid(),
        userId: users[0].id,
      })
    })

    test('it should return an assessment', async () => {
      // const expectedAssessment = await getAssessment({assessmentId})
      // console.log(createadAssessment)

      const receivedAssessment = await getAssessmentService({
        assessmentId: createadAssessment.id,
      })
      console.log(
        inspect(receivedAssessment, {
          showHidden: false,
          depth: null,
          colors: true,
        }),
      )

      // expect(assessment).toEqual(expectedAssessment.data)
    })
  })

  describe('Integration test: createManyAssessmentService', () => {
    let assessments: Record<string, any> = {}

    const word = faker.lorem.word()
    const userId = faker.string.uuid()
    const assessmentId_1 = faker.string.uuid()
    const assessmentId_2 = faker.string.uuid()
    const assessmentIds = [
      {assessmentId: assessmentId_1},
      {assessmentId: assessmentId_2},
    ]

    beforeAll(async () => {
      await prisma.user.create({data: {id: userId, name: word}})
      assessments = await prisma.assessment.createMany({
        data: [
          {id: assessmentId_1, title: word, description: word, ownerId: userId},
          {id: assessmentId_2, title: word, description: word, ownerId: userId},
        ],
      })
    })

    afterAll(async () => {
      await prisma.assessment.deleteMany({
        where: {id: {in: [assessmentId_1, assessmentId_2]}},
      })
      await prisma.user.delete({where: {id: userId}})
    })

    test('it should return many assessments', async () => {
      const expectedAssessments: any = []

      for (let i = 0; i < assessments.count; i++) {
        expectedAssessments.push(
          await prisma.assessment.findUnique({
            where: {id: assessmentIds[i].assessmentId},
            select: {
              id: true,
              title: true,
              assessmentQuizzes: {
                select: {
                  quizId: true,
                },
              },
              assessmentCandidates: {
                select: {
                  status: true,
                  candidate: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              createdAt: true,
              description: true,
            },
          }),
        )
      }

      expect(await getManyAssessmentService({userId})).toEqual(
        expectedAssessments,
      )
    })
  })
})
