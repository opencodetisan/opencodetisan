import {
  createAssessmentService,
  getAssessmentsService,
} from '@/lib/core/service'
import prisma from '@/lib/db/client'
import {faker} from '@faker-js/faker'

const uuid = faker.string.uuid()
const word = faker.lorem.word()

describe('Integration test: Assessment', () => {
  describe('Integration test: createAssessmentService', () => {
    beforeAll(async () => {
      await prisma.user.create({data: {id: uuid, name: word}})
      await prisma.codeLanguage.create({data: {id: 1, name: word}})
      await prisma.difficultyLevel.create({data: {id: 1, name: word}})
      await prisma.quiz.create({
        data: {
          id: uuid,
          title: word,
          userId: uuid,
          codeLanguageId: 1,
          difficultyLevelId: 1,
        },
      })
    })

    afterAll(async () => {
      await prisma.assessmentQuiz.deleteMany()
      await prisma.assessment.deleteMany()
      await prisma.quiz.deleteMany()
      await prisma.codeLanguage.deleteMany()
      await prisma.difficultyLevel.deleteMany()
      await prisma.user.deleteMany()
    })

    test('it should create a new assessment', async () => {
      const assessment = await createAssessmentService({
        userId: uuid,
        title: word,
        description: word,
        quizIds: [uuid],
      })

      expect(
        await prisma.assessment.findUnique({
          where: {id: assessment.id},
          include: {
            assessmentCandidateEmail: true,
            owner: {
              select: {
                adminContact: {
                  select: {
                    companyName: true,
                  },
                },
              },
            },
          },
        }),
      ).toEqual(assessment)
    })

    test('missing userId param should return a missing userId error', async () => {
      const param: any = {
        // userId: uuid,
        title: word,
        description: word,
        quizIds: [uuid],
      }
      expect(async () => await createAssessmentService(param)).rejects.toThrow(
        /^missing userId$/,
      )
    })

    test('missing title param should return a missing title error', async () => {
      const param: any = {
        userId: uuid,
        // title: word,
        description: word,
        quizIds: [uuid],
      }
      expect(async () => await createAssessmentService(param)).rejects.toThrow(
        /^missing title$/,
      )
    })

    test('missing description param should return a missing description error', async () => {
      const param: any = {
        userId: uuid,
        title: word,
        // description: word,
        quizIds: [uuid],
      }
      expect(async () => await createAssessmentService(param)).rejects.toThrow(
        /^missing description$/,
      )
    })

    test('missing quizIds param should return a missing quizIds error', async () => {
      const param: any = {
        userId: uuid,
        title: word,
        description: word,
        // quizIds: [uuid],
      }
      expect(async () => await createAssessmentService(param)).rejects.toThrow(
        /^missing quizIds$/,
      )
    })

    test('empty quizIds param should return an empty quizIds error', async () => {
      const param: any = {
        userId: uuid,
        title: word,
        description: word,
        quizIds: [],
      }
      expect(async () => await createAssessmentService(param)).rejects.toThrow(
        /^empty quizIds$/,
      )
    })
  })

  describe('Integration test: createAssessmentService', () => {
    let assessments: Record<string, any> = {}

    beforeAll(async () => {
      await prisma.user.create({data: {id: uuid, name: word}})
      assessments = await prisma.assessment.createMany({
        data: [
          {id: uuid + 1, title: word, description: word, ownerId: uuid},
          {id: uuid + 2, title: word, description: word, ownerId: uuid},
        ],
      })
    })

    afterAll(async () => {
      await prisma.assessment.deleteMany()
      await prisma.user.deleteMany()
    })

    test('empty quizIds param should return an empty quizIds error', async () => {
      const expectedAssessments: any = []

      for (let i = 1; i <= assessments.count; i++) {
        expectedAssessments.push(
          await prisma.assessment.findUnique({
            where: {id: uuid + i},
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

      expect(await getAssessmentsService({userId: uuid})).toEqual(
        expectedAssessments,
      )
    })

    test('missing userId param should return an empty quizIds error', async () => {
      const param: any = {}
      expect(async () => await getAssessmentsService(param)).rejects.toThrow(
        /^missing userId$/,
      )
    })
  })
})
