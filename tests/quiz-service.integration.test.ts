import {
  createQuizService,
  getQuizService,
  updateQuizService,
} from '@/lib/core/service'
import prisma from '@/lib/db/client'
import {faker} from '@faker-js/faker'

describe('Integration test: Quiz ', () => {
  describe('Integration test: createQuizService', () => {
    const word = faker.lorem.word()
    const codeLanguageId = faker.number.int({min: 1, max: 1000})
    const difficultyLevelId = faker.number.int({min: 1, max: 1000})
    const userId = faker.string.uuid()

    let quizId: string, solutionId: string

    beforeAll(async () => {
      await prisma.codeLanguage.create({
        data: {id: codeLanguageId, name: word},
      })
      await prisma.difficultyLevel.create({
        data: {id: difficultyLevelId, name: word},
      })
      await prisma.user.create({data: {id: userId, name: word}})
    })

    afterAll(async () => {
      await prisma.testCase.deleteMany({where: {solutionId: solutionId}})
      await prisma.solution.delete({where: {id: solutionId}})
      await prisma.quiz.delete({where: {id: quizId}})
      await prisma.codeLanguage.delete({where: {id: codeLanguageId}})
      await prisma.difficultyLevel.delete({where: {id: difficultyLevelId}})
      await prisma.user.delete({where: {id: userId}})
    })

    test('it should create new quiz and return quiz, solution, and testCases objects', async () => {
      const param = {
        quizData: {
          title: word,
          userId,
          codeLanguageId,
          difficultyLevelId,
          instruction: word,
          answer: word,
          defaultCode: word,
          locale: word,
        },
        quizSolution: {
          code: word,
          sequence: 1,
          testRunner: word,
          importDirectives: word,
        },
        quizTestCases: {input: [word, word], output: [word, word]},
      }

      const createQuizResult = await createQuizService(param)
      const {quiz, solution, testCases} = createQuizResult
      quizId = quiz.id
      solutionId = solution.id

      const expectedQuizData = await prisma.quiz.findUnique({
        where: {id: quiz.id},
      })
      const expectedQuizSolution = await prisma.solution.findUnique({
        where: {id: solution.id},
      })
      const expectedQuizTestCaseCount = await prisma.testCase.count({
        where: {solutionId: solution.id},
      })

      expect(createQuizResult).toEqual({
        quiz: expectedQuizData,
        solution: expectedQuizSolution,
        testCases: {count: expectedQuizTestCaseCount},
      })
    })
  })

  describe('Integration test: getQuizService', () => {
    const word = faker.lorem.word()
    const codeLanguageId = faker.number.int({min: 1, max: 1000})
    const difficultyLevelId = faker.number.int({min: 1, max: 1000})
    const userId = faker.string.uuid()
    const quizId = faker.string.uuid()

    let expectedQuiz: Record<string, any>

    beforeAll(async () => {
      await prisma.user.create({data: {id: userId, name: word}})
      await prisma.codeLanguage.create({
        data: {id: codeLanguageId, name: word},
      })
      await prisma.difficultyLevel.create({
        data: {id: difficultyLevelId, name: word},
      })
      expectedQuiz = await prisma.quiz.create({
        data: {
          id: quizId,
          title: word,
          userId,
          codeLanguageId,
          difficultyLevelId,
        },
        select: {
          id: true,
          title: true,
          instruction: true,
          submissionCachedCount: true,
          difficultyLevelId: true,
          codeLanguageId: true,
          codeLanguage: {
            select: {
              id: true,
              prettyName: true,
            },
          },
          status: true,
          locale: true,
          createdAt: true,
          updatedAt: true,
          defaultCode: true,
          solutions: {
            select: {
              id: true,
              code: true,
              testCases: {
                select: {
                  id: true,
                  input: true,
                  output: true,
                },
              },
              importDirectives: true,
              testRunner: true,
            },
          },
        },
      })
    })

    afterAll(async () => {
      await prisma.quiz.delete({where: {id: quizId}})
      await prisma.codeLanguage.delete({where: {id: codeLanguageId}})
      await prisma.difficultyLevel.delete({where: {id: difficultyLevelId}})
      await prisma.user.delete({where: {id: userId}})
    })

    test('it should return quiz', async () => {
      const param = {quizId}
      expect(await getQuizService(param)).toEqual(expectedQuiz)
    })
  })

  describe('Integration test: updateQuizService', () => {
    const codeLanguageId = faker.number.int({min: 1, max: 1000})
    const difficultyLevelId = faker.number.int({min: 1, max: 1000})
    const userId = faker.string.uuid()

    let solutionId: string
    let quizId: string
    let createQuizResult: Record<string, any>

    beforeAll(async () => {
      const word = faker.lorem.word()

      const param = {
        quizData: {
          title: word,
          userId,
          codeLanguageId,
          difficultyLevelId,
          instruction: word,
          answer: word,
          defaultCode: word,
          locale: word,
        },
        quizSolution: {
          code: word,
          sequence: faker.number.int({min: 1, max: 10}),
          testRunner: word,
          importDirectives: word,
        },
        quizTestCases: {input: [word, word], output: [word, word]},
      }

      await prisma.codeLanguage.create({
        data: {id: codeLanguageId, name: word},
      })
      await prisma.difficultyLevel.create({
        data: {id: difficultyLevelId, name: word},
      })
      await prisma.user.create({data: {id: userId, name: word}})
      createQuizResult = await createQuizService(param)
    })

    // afterAll(async () => {
    //   await prisma.testCase.deleteMany({where: {solutionId: solutionId}})
    //   await prisma.solution.delete({where: {id: solutionId}})
    //   await prisma.quiz.delete({where: {id: quizId}})
    //   await prisma.codeLanguage.delete({where: {id: codeLanguageId}})
    //   await prisma.difficultyLevel.delete({where: {id: difficultyLevelId}})
    //   await prisma.user.delete({where: {id: userId}})
    // })

    test('it should update existing quiz and return quiz, solution, and testCases objects', async () => {
      const word = faker.lorem.word()

      const updateQuizParam = {
        quizData: {
          title: word,
          userId,
          codeLanguageId,
          difficultyLevelId,
          instruction: word,
          answer: word,
          defaultCode: word,
          locale: word,
        },
        quizSolution: {
          code: word,
          sequence: faker.number.int({min: 1, max: 10}),
          testRunner: word,
          importDirectives: word,
        },
        quizTestCases: {input: [word, word], output: [word, word]},
      }

      // const updateQuizResult = await updateQuizService(param)
      // const {quiz, solution, testCases} = updateQuizResult
      // quizId = quiz.id
      // solutionId = solution.id
      //
      // expect(updateQuizResult).toEqual(createQuizResult)
    })
  })
})
