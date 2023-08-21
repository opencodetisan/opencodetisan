import {
  createQuiz,
  createQuizSolution,
  createQuizTestCase,
  deleteQuiz,
  deleteQuizSolution,
  deleteQuizTestCases,
  getAllUserQuizzes,
  getQuiz,
  getQuizSolutionIds,
  updateQuiz,
  updateQuizSolution,
  updateQuizTestCases,
} from '@/lib/core/quiz'
import {faker} from '@faker-js/faker'
import {prismaMock} from '@/lib/db/prisma-mock-singleton'

const word = faker.lorem.word()
const uuid = faker.string.uuid()
const date = faker.date.anytime()
const number = faker.number.int(1000)

const fakeQuizTestCase = {
  id: uuid,
  input: word,
  output: word,
  sequence: number,
  createdAt: date,
  updatedAt: date,
  solutionId: uuid,
}

const fakeQuizSolution = {
  quizId: uuid,
  id: uuid,
  importDirectives: word,
  code: word,
  sequence: number,
  createdAt: date,
  updatedAt: date,
  testRunner: word,
}

const fakeQuiz: any = {
  id: uuid,
  title: word,
  userId: uuid,
  codeLanguageId: number,
  createdAt: date,
  updatedAt: date,
  instruction: word,
  answer: word,
  submissionCachedCount: number,
  defaultCode: word,
  difficultyLevelId: number,
  locale: word,
  status: word,
  solutions: [
    {
      quizId: uuid,
      id: uuid,
      importDirectives: word,
      code: word,
      sequence: number,
      createdAt: date,
      updatedAt: date,
      testRunner: word,

      testCases: [
        {
          id: uuid,
          input: word,
          output: word,
          sequence: number,
          createdAt: date,
          updatedAt: date,
          solutionId: uuid,
        },
      ],
    },
  ],
}

const fakeGetQuizOutput = {
  quizData: {
    id: uuid,
    title: word,
    userId: uuid,
    codeLanguageId: number,
    createdAt: date,
    updatedAt: date,
    instruction: word,
    answer: word,
    submissionCachedCount: number,
    defaultCode: word,
    difficultyLevelId: number,
    locale: word,
    status: word,
  },
  quizSolution: [
    {
      quizId: uuid,
      id: uuid,
      importDirectives: word,
      code: word,
      sequence: number,
      createdAt: date,
      updatedAt: date,
      testRunner: word,
    },
  ],
  quizTestCases: [
    {
      id: uuid,
      input: word,
      output: word,
      sequence: number,
      createdAt: date,
      updatedAt: date,
      solutionId: uuid,
    },
  ],
}

describe('Quiz module', () => {
  test('createQuiz function should save the quiz data and return the saved data', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    prismaMock.quiz.create.mockResolvedValue(quizData)
    const savedQuiz = await createQuiz(quizData)
    expect(savedQuiz).toBe(quizData)
  })

  test('Missing title parameter should raise an missing title error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      //title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing quiz title$/,
    )
  })

  test('Missing codeLanguageId parameter should raise an missing code language error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      // codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing codeLanguageId$/,
    )
  })

  test('Missing userId parameter should raise an missing user id error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      // userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('Missing difficultyLevelId parameter should raise a missing difficulty level id error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      // difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing difficultyLevelId$/,
    )
  })

  test('Missing instruction parameter should raise a missing instruction error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      // instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing instruction$/,
    )
  })

  test('Missing answer parameter should raise a missing answer error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      // answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing answer$/,
    )
  })

  test('Missing defaultCode parameter should raise a missing defaultCode error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      // defaultCode: faker.lorem.paragraphs(),
      locale: 'en',
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing defaultCode$/,
    )
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      // locale: "en",
    }
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      /^missing locale$/,
    )
  })

  test('createQuizSolution fn should save and return quiz solution', async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    }
    prismaMock.solution.create.mockResolvedValue(solutionData)
    const savedQuizSolution = await createQuizSolution(solutionData)
    expect(savedQuizSolution).toEqual(solutionData)
  })

  test('Missing quizId parameter should raise a missing quiz id error', async () => {
    const solutionData: any = {
      // quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    }
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('Missing code parameter should raise a missing code error', async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      // code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    }
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      /^missing code$/,
    )
  })

  test('Missing sequence parameter should raise a missing sequence error', async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      // sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    }
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      /^missing sequence$/,
    )
  })

  test('Missing importDirectives parameter should raise a missing import directives error', async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      // importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    }
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      /^missing importDirectives$/,
    )
  })

  test('Missing testRunner parameter should raise a missing test runner error', async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      // testRunner: faker.lorem.paragraphs(),
    }
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      /^missing testRunner$/,
    )
  })

  test('createQuizTestCase fn should save and return test cases', async () => {
    const param: any = {
      solutionId: uuid,
      input: word,
      output: word,
      sequence: number,
    }
    prismaMock.testCase.create.mockResolvedValue(fakeQuizTestCase)
    const createdQuizTestCase = await createQuizTestCase(param)

    expect(createdQuizTestCase).toEqual(fakeQuizTestCase)
  })

  test('Missing solutionId should raise a missing solutionId error', async () => {
    const param: any = {
      // solutionId: faker.string.uuid(),
      input: faker.lorem.text(),
      output: faker.lorem.text(),
      sequence: 1,
    }
    expect(async () => await createQuizTestCase(param)).rejects.toThrow(
      /^missing solutionId$/,
    )
  })

  test('Missing input should raise a missing input error', async () => {
    const param: any = {
      solutionId: faker.string.uuid(),
      // input: faker.lorem.text(),
      output: faker.lorem.text(),
      sequence: 1,
    }
    expect(async () => await createQuizTestCase(param)).rejects.toThrow(
      /^missing input$/,
    )
  })

  test('Missing output should raise a missing output error', async () => {
    const param: any = {
      solutionId: faker.string.uuid(),
      input: faker.lorem.text(),
      // output: faker.lorem.text(),
      sequence: 1,
    }
    expect(async () => await createQuizTestCase(param)).rejects.toThrow(
      /^missing output$/,
    )
  })
  test('Missing sequence should raise a missing sequence error', async () => {
    const param: any = {
      solutionId: faker.string.uuid(),
      input: faker.lorem.text(),
      output: faker.lorem.text(),
      // sequence: 1,
    }
    expect(async () => await createQuizTestCase(param)).rejects.toThrow(
      /^missing sequence$/,
    )
  })

  test('updateQuiz fn should update and return updated quiz data', async () => {
    const quizData: any = {
      userId: faker.string.uuid(),
      id: faker.string.uuid(),
    }
    prismaMock.quiz.update.mockResolvedValue(quizData)
    expect(await updateQuiz(quizData)).toEqual(quizData)
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizData: any = {
      userId: faker.string.uuid(),
      // id: faker.string.uuid(),
    }
    expect(async () => await updateQuiz(quizData)).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('Missing userId parameter should raise a missing userId error', async () => {
    const quizData: any = {
      // userId: faker.string.uuid(),
      id: faker.string.uuid(),
    }
    expect(async () => await updateQuiz(quizData)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('updateQuizSolution fn should update and return updated quiz solution', async () => {
    const solutionData: any = {
      solutionId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
      // defaultCode: faker.lorem.paragraph()
    }
    prismaMock.solution.update.mockResolvedValue(solutionData)
    expect(await updateQuizSolution(solutionData)).toEqual(solutionData)
  })

  test('Missing solutionId parameter should raise a missing solutionId error', async () => {
    const solutionData: any = {
      // solutionId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraph(),
    }
    expect(async () => await updateQuizSolution(solutionData)).rejects.toThrow(
      /^missing solutionId$/,
    )
  })

  test('Missing code parameter should raise a missing code id error', async () => {
    const solutionData: any = {
      solutionId: faker.string.uuid(),
      // code: faker.lorem.paragraphs(),
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraph(),
    }
    expect(async () => await updateQuizSolution(solutionData)).rejects.toThrow(
      /^missing code$/,
    )
  })

  test('updateQuizTestCases fn should update and return updated quiz test cases', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [faker.lorem.text], output: [faker.lorem.text()]},
    }
    prismaMock.testCase.update.mockResolvedValue(testCaseData)
    prismaMock.$transaction.mockResolvedValue(testCaseData)
    expect(await updateQuizTestCases(testCaseData)).toEqual(testCaseData)
  })

  test('Missing existingTests parameter should raise a missing existingTests error', async () => {
    const testCaseData: any = {
      // existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [faker.lorem.text], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^missing existingTests$/,
    )
  })

  test('Empty existingTests parameter should raise a 0 existingTest found error', async () => {
    const testCaseData: any = {
      existingTests: [],
      newTests: {input: [faker.lorem.text], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^0 existingTest found$/,
    )
  })

  test('Missing newTests parameter should raise a missing tests error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      // newTests: {input: [faker.lorem.text], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^missing newTests$/,
    )
  })

  test('Missing newTests input field should raise a missing tests input field error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^missing newTests input field$/,
    )
  })

  test('Empty newTests input field should raise a 0 tests input found error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^0 newTests input found$/,
    )
  })

  test('Missing newTests output field should raise a missing tests output field error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [faker.lorem.text]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^missing newTests output field$/,
    )
  })

  test('Empty newTests output field should raise a 0 tests output found error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [faker.lorem.text()], output: []},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      /^0 newTests output found$/,
    )
  })

  test('deleteQuizTestCases fn should delete and return test case', async () => {
    const param = {testCaseId: uuid}
    prismaMock.testCase.delete.mockResolvedValue(fakeQuizTestCase)
    expect(await deleteQuizTestCases(param)).toEqual(fakeQuizTestCase)
  })

  test('Missing testCaseId parameter should raise a missing testCaseId error', async () => {
    const param: any = {}
    expect(async () => await deleteQuizTestCases(param)).rejects.toThrow(
      /^missing testCaseId$/,
    )
  })

  test('deleteQuizSolution fn should delete and return solution', async () => {
    const param = {solutionId: uuid}
    prismaMock.solution.delete.mockResolvedValue(fakeQuizSolution)
    expect(await deleteQuizSolution(param)).toEqual(fakeQuizSolution)
  })

  test('Missing solutionId parameter should raise a missing solutionId error', async () => {
    const param: any = {}
    expect(async () => await deleteQuizSolution(param)).rejects.toThrow(
      /^missing solutionId$/,
    )
  })

  test('deleteQuiz fn should delete quiz and return deleted quiz', async () => {
    const deletedQuiz: any = {title: faker.lorem.text()}
    prismaMock.quiz.delete.mockResolvedValue(deletedQuiz)
    expect(await deleteQuiz({quizId: faker.string.uuid()})).toEqual(deletedQuiz)
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizId: any = undefined
    expect(async () => await deleteQuiz({quizId})).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('getQuizSolutionIds fn should return solutionIds', async () => {
    const solutionIds: any = [faker.string.uuid(), faker.string.uuid()]
    prismaMock.quiz.findUnique.mockResolvedValue(solutionIds)
    expect(await getQuizSolutionIds({quizId: faker.string.uuid()})).toEqual(
      solutionIds,
    )
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizId: any = undefined
    expect(async () => await getQuizSolutionIds({quizId})).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('getAllUserQuizzes fn should return quizzes', async () => {
    const quizzes: any = [{id: 1}, {id: 2}]
    prismaMock.quiz.findMany.mockResolvedValue(quizzes)
    expect(
      await getAllUserQuizzes({
        userId: faker.string.uuid(),
        locale: faker.lorem.text(),
      }),
    ).toEqual(quizzes)
  })

  test('Missing userId parameter should raise a missing userId error', async () => {
    const userId: any = undefined
    expect(
      async () =>
        await getAllUserQuizzes({
          userId,
          locale: faker.lorem.text(),
        }),
    ).rejects.toThrow(/^missing userId$/)
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const locale: any = undefined
    expect(
      async () =>
        await getAllUserQuizzes({
          locale,
          userId: faker.lorem.text(),
        }),
    ).rejects.toThrow(/^missing locale$/)
  })

  test('deleteQuiz fn should delete quiz and return deleted quiz', async () => {
    const deletedQuiz: any = {title: faker.lorem.text()}
    prismaMock.quiz.delete.mockResolvedValue(deletedQuiz)
    expect(await deleteQuiz({quizId: faker.string.uuid()})).toEqual(deletedQuiz)
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizId: any = undefined
    expect(async () => await deleteQuiz({quizId})).rejects.toThrow(
      'missing quizId',
    )
  })

  test('getQuizSolutionIds fn should return solutionIds', async () => {
    const solutionIds: any = [faker.string.uuid(), faker.string.uuid()]
    prismaMock.quiz.findUnique.mockResolvedValue(solutionIds)
    expect(await getQuizSolutionIds({quizId: faker.string.uuid()})).toEqual(
      solutionIds,
    )
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizId: any = undefined
    expect(async () => await getQuizSolutionIds({quizId})).rejects.toThrow(
      'missing quizId',
    )
  })

  test('getAllUserQuizzes fn should return quizzes', async () => {
    const quizzes: any = [{id: 1}, {id: 2}]
    prismaMock.quiz.findMany.mockResolvedValue(quizzes)
    expect(
      await getAllUserQuizzes({
        userId: faker.string.uuid(),
        locale: faker.lorem.text(),
      }),
    ).toEqual(quizzes)
  })

  test('Missing userId parameter should raise a missing userId error', async () => {
    const userId: any = undefined
    expect(
      async () =>
        await getAllUserQuizzes({
          userId,
          locale: faker.lorem.text(),
        }),
    ).rejects.toThrow(/^missing userId$/)
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const locale: any = undefined
    expect(
      async () =>
        await getAllUserQuizzes({
          locale,
          userId: faker.lorem.text(),
        }),
    ).rejects.toThrow(/^missing locale$/)
  })

  test('getQuiz fn should return quiz', async () => {
    const param: any = {quizId: uuid}
    prismaMock.quiz.findUnique.mockResolvedValue(fakeQuiz)
    expect(await getQuiz(param)).toEqual(fakeGetQuizOutput)
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const param: any = {}
    expect(async () => await getQuiz(param)).rejects.toThrow(/^missing quizId$/)
  })
})
