import {getAssessment} from '@/lib/core/assessment'
import {
  acceptAssessmentService,
  createAssessmentService,
  createCandidateSubmissionService,
  getAssessmentService,
  getManyAssessmentService,
  updateAssessmentDataService,
  updateCandidateSubmissionService,
} from '@/lib/core/service'
import prisma from '@/lib/db/client'
import {faker} from '@faker-js/faker'
import {inspect} from 'node:util'

const createFakeQuizzes = async ({userId}: {userId: string}) => {
  const word = faker.lorem.word()
  const codeLanguageId = faker.number.int(100000)
  const difficultyLevelId = faker.number.int(1000)
  const createQuizPromises: Promise<any>[] = []

  await prisma.assessmentPoint.createMany({
    data: [
      {name: 'easyQuizCompletionPoint', point: 1000},
      {name: 'speedPoint', point: 500},
    ],
  })
  await prisma.codeLanguage.create({data: {id: codeLanguageId, name: word}})
  await prisma.difficultyLevel.create({
    data: {id: difficultyLevelId, name: 'easy'},
  })

  for (let i = 0; i < 2; i++) {
    createQuizPromises.push(
      prisma.quiz.create({
        data: {
          title: `quiz_${i + 1}`,
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
  const uuids = [faker.string.uuid(), faker.string.uuid()]
  uuids.forEach((id) => {
    promises.push(prisma.user.create({data: {id, name: faker.lorem.word()}}))
  })
  return Promise.all(promises)
}

const createFakeCandidateSubmission = async ({
  assessmentId,
  quizId,
  userId,
  code,
}: {
  assessmentId: string
  quizId: string
  userId: string
  code: string
}) => {
  const createdSubmission = await createCandidateSubmissionService({
    assessmentId,
    quizId,
    userId,
  })
  const updatedSubmission = await updateCandidateSubmissionService({
    userId,
    quizId,
    code,
    assessmentQuizSubmissionId:
      createdSubmission.assessmentQuizSubmissions[0].id,
  })
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
    const codes = [
      'This is the first attempt',
      'This is the most recent attempt',
    ]
    let createadAssessment: any
    let quizzes: Record<string, any>[]
    let users: Record<string, any>[]

    beforeAll(async () => {
      await prisma.userAction.create({data: {id: 1, userAction: 'accept'}})
      users = await createFakeUsers()
      quizzes = await createFakeQuizzes({userId: users[0].id})
      const quizIds = quizzes.map((q) => q.id)

      createadAssessment = await createAssessmentService({
        userId: users[0].id,
        title: word,
        description: word,
        quizIds,
      })
      for (let i = 0; i < users.length; i++) {
        await acceptAssessmentService({
          assessmentId: createadAssessment.id,
          token: faker.string.uuid(),
          userId: users[i].id,
        })
      }
      for (let i = 0; i < codes.length; i++) {
        await createFakeCandidateSubmission({
          userId: users[0].id,
          quizId: quizzes[0].id,
          assessmentId: createadAssessment.id,
          code: codes[i],
        })
      }
    })

    test('it should return the assessment data', async () => {
      const receivedAssessment = await getAssessmentService({
        assessmentId: createadAssessment.id,
      })
      const assessmentQuizSubmissions =
        receivedAssessment.submissions[0].data[1].assessmentQuizSubmissions

      receivedAssessment.quizzes.forEach((q) => {
        delete q.difficultyLevel
      })

      expect(receivedAssessment.data).toEqual(createadAssessment)
      expect(assessmentQuizSubmissions[0].submission.code).toBe(codes[1])
      expect(quizzes).toMatchObject(receivedAssessment.quizzes)
      expect(users).toMatchObject(receivedAssessment.candidates)
      expect(
        receivedAssessment.submissions[0].data[0].assessmentQuizSubmissions,
      ).toHaveLength(0)
      expect(
        receivedAssessment.submissions[0].data[1].assessmentQuizSubmissions,
      ).toHaveLength(1)
    })
  })

  describe('Integration test: updateAssessmentDataService', () => {
    let users
    let quizzes
    let createdAssessment: Record<string, any>

    const word = faker.lorem.words()

    beforeAll(async () => {
      users = await createFakeUsers()
      quizzes = await createFakeQuizzes({userId: users[0].id})
      const quizIds = quizzes.map((q) => q.id)

      createdAssessment = await createAssessmentService({
        userId: users[0].id,
        title: word,
        description: word,
        quizIds,
      })
    })

    test('it should update and return an assessment', async () => {
      const receivedAssessment = await updateAssessmentDataService({
        assessmentId: createdAssessment.id,
        description: word,
        title: word,
      })
      const expectedAssessment = await getAssessmentService({
        assessmentId: receivedAssessment.id,
      })

      expect(receivedAssessment).toEqual(expectedAssessment.data)
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
