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

    let quizId: string
    let solutionId: string

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
          sequence: faker.number.int({min: 1, max: 1000}),
          testRunner: word,
          importDirectives: word,
        },
        quizTestCases: {input: [word, word], output: [word, word]},
      }

      const createdQuiz = await createQuizService(param)
      const {quizData, quizSolution, quizTestCases} = createdQuiz
      quizId = quizData.id
      solutionId = quizSolution[0].id
      const expectedQuiz = await getQuizService({quizId})

      expect(createdQuiz).toEqual(expectedQuiz)
    })
  })

  describe('Integration test: getQuizService', () => {
    const word = faker.lorem.word()
    const codeLanguageId = faker.number.int({min: 1, max: 1000})
    const difficultyLevelId = faker.number.int({min: 1, max: 1000})
    const userId = faker.string.uuid()

    let expectedQuiz: Record<string, any>
    let quizId: string
    let solutionId: string

    beforeAll(async () => {
      const createQuizParam = {
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
          sequence: faker.number.int({min: 1, max: 1000}),
          testRunner: word,
          importDirectives: word,
        },
        quizTestCases: {input: [word, word], output: [word, word]},
      }

      await prisma.user.create({data: {id: userId, name: word}})
      await prisma.codeLanguage.create({
        data: {id: codeLanguageId, name: word},
      })
      await prisma.difficultyLevel.create({
        data: {id: difficultyLevelId, name: word},
      })
      expectedQuiz = await createQuizService(createQuizParam)

      quizId = expectedQuiz.quizData.id
      solutionId = expectedQuiz.quizSolution[0].id
    })

    afterAll(async () => {
      await prisma.testCase.deleteMany({where: {solutionId}})
      await prisma.solution.delete({where: {id: solutionId}})
      await prisma.quiz.delete({where: {id: quizId}})
      await prisma.codeLanguage.delete({where: {id: codeLanguageId}})
      await prisma.difficultyLevel.delete({where: {id: difficultyLevelId}})
      await prisma.user.delete({where: {id: userId}})
    })

    test('it should return quiz', async () => {
      const param = {quizId}
      const receivedQuiz = await getQuizService(param)
      expect(receivedQuiz).toEqual(expectedQuiz)
    })
  })

  describe('Integration test: updateQuizService', () => {
    const codeLanguageId = faker.number.int({min: 1, max: 1000})
    const difficultyLevelId = faker.number.int({min: 1, max: 1000})
    const userId = faker.string.uuid()

    let solutionId: string
    let quizId: string

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
      const createdQuiz = await createQuizService(param)

      quizId = createdQuiz.quizData.id
      solutionId = createdQuiz.quizSolution[0].id
    })

    afterAll(async () => {
      await prisma.testCase.deleteMany({where: {solutionId: solutionId}})
      await prisma.solution.delete({where: {id: solutionId}})
      await prisma.quiz.delete({where: {id: quizId}})
      await prisma.codeLanguage.delete({where: {id: codeLanguageId}})
      await prisma.difficultyLevel.delete({where: {id: difficultyLevelId}})
      await prisma.user.delete({where: {id: userId}})
    })

    test('it should update and return quiz', async () => {
      const word = faker.lorem.word()

      const updateQuizParam = {
        quizData: {
          id: quizId,
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
          solutionId,
          code: word,
          sequence: faker.number.int({min: 1, max: 10}),
          testRunner: word,
          importDirectives: word,
        },
        quizTestCases: {input: [word, word], output: [word, word]},
      }

      const updatedQuiz = await updateQuizService(updateQuizParam)
      const expectedQuiz = await getQuizService({quizId})

      expect(updatedQuiz).toEqual(expectedQuiz)
    })
  })
})
