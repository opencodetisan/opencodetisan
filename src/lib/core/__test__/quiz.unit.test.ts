import {
  createQuiz,
  createQuizSolution,
  createQuizTestCases,
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
      'missing quiz title',
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
      'missing codeLanguageId',
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
      'missing userId',
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
      'missing difficultyLevelId',
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
      'missing instruction',
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
      'missing answer',
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
      'missing defaultCode',
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
      'missing locale',
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
      'missing quizId',
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
      'missing code',
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
      'missing sequence',
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
      'missing importDirectives',
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
      'missing testRunner',
    )
  })

  test('createQuizTestCases fn should save and return test cases', async () => {
    const testCaseData: any = [
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
    ]
    prismaMock.testCase.createMany.mockResolvedValue(testCaseData)
    const saveQuizTestCases = await createQuizTestCases(testCaseData)
    expect(saveQuizTestCases).toEqual(testCaseData)
  })

  test('Missing solutionId should raise a test case missing solutionId error', async () => {
    const testCaseData: any = [
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
      {
        // solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
    ]
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      'test case missing solutionId',
    )
  })

  test('Missing input should raise a test case missing input error', async () => {
    const testCaseData: any = [
      {
        solutionId: faker.string.uuid(),
        // input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
    ]
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      'test case missing input',
    )
  })

  test('Missing output should raise a test case missing output error', async () => {
    const testCaseData: any = [
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        // output: faker.lorem.text(),
        sequence: 1,
      },
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        // output: faker.lorem.text(),
        sequence: 1,
      },
    ]
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      'test case missing output',
    )
  })
  test('Missing sequence should raise a test case missing sequence error', async () => {
    const testCaseData: any = [
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        // sequence: 1,
      },
    ]
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      'test case missing sequence',
    )
  })

  test('Undefined testCaseData should raise a test case not found error', async () => {
    const testCaseData: any = undefined
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      'test case not found',
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
      'missing quizId',
    )
  })

  test('Missing userId parameter should raise a missing userId error', async () => {
    const quizData: any = {
      // userId: faker.string.uuid(),
      id: faker.string.uuid(),
    }
    expect(async () => await updateQuiz(quizData)).rejects.toThrow(
      'missing userId',
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
      'missing solutionId',
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
      'missing code',
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
      'missing existingTests',
    )
  })

  test('Empty existingTests parameter should raise a 0 existingTest found error', async () => {
    const testCaseData: any = {
      existingTests: [],
      newTests: {input: [faker.lorem.text], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      '0 existingTest found',
    )
  })

  test('Missing newTests parameter should raise a missing tests error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      // newTests: {input: [faker.lorem.text], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      'missing newTests',
    )
  })

  test('Missing newTests input field should raise a missing tests input field error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      'missing newTests input field',
    )
  })

  test('Empty newTests input field should raise a 0 tests input found error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [], output: [faker.lorem.text()]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      '0 newTests input found',
    )
  })

  test('Missing newTests output field should raise a missing tests output field error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [faker.lorem.text]},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      'missing newTests output field',
    )
  })

  test('Empty newTests output field should raise a 0 tests output found error', async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      newTests: {input: [faker.lorem.text()], output: []},
    }
    expect(async () => await updateQuizTestCases(testCaseData)).rejects.toThrow(
      '0 newTests output found',
    )
  })

  test('deleteQuizTestCases fn should delete test cases and return count number', async () => {
    prismaMock.testCase.deleteMany.mockResolvedValue({count: 4})
    expect(
      await deleteQuizTestCases({solutionId: faker.string.uuid()}),
    ).toEqual({count: 4})
  })

  test('Missing solutionId parameter should raise a missing solutionId error', async () => {
    const solutionId: any = undefined
    expect(async () => await deleteQuizTestCases({solutionId})).rejects.toThrow(
      'missing solutionId',
    )
  })

  test('deleteQuizSolution fn should delete solutions and return count number', async () => {
    prismaMock.solution.deleteMany.mockResolvedValue({count: 4})
    expect(await deleteQuizSolution({quizId: faker.string.uuid()})).toEqual({
      count: 4,
    })
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizId: any = undefined
    expect(async () => await deleteQuizSolution({quizId})).rejects.toThrow(
      'missing quizId',
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
    ).rejects.toThrow('missing userId')
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const locale: any = undefined
    expect(
      async () =>
        await getAllUserQuizzes({
          locale,
          userId: faker.lorem.text(),
        }),
    ).rejects.toThrow('missing locale')
  })

  test('getQuiz fn should return quiz', async () => {
    const quizData: any = {quizId: 1}
    prismaMock.quiz.findUnique.mockResolvedValue(quizData)
    expect(await getQuiz(quizData)).toEqual(quizData)
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const quizData: any = {quizId: undefined}
    expect(async () => await getQuiz(quizData)).rejects.toThrow(
      'missing quizId',
    )
  })

  test('deleteQuizTestCases fn should delete test cases and return count number', async () => {
    prismaMock.testCase.deleteMany.mockResolvedValue({count: 4})
    expect(
      await deleteQuizTestCases({solutionId: faker.string.uuid()}),
    ).toEqual({count: 4})
  })

  test('Missing solutionId parameter should raise a missing solutionId error', async () => {
    const solutionId: any = undefined
    prismaMock.testCase.deleteMany.mockResolvedValue({count: 4})
    expect(async () => await deleteQuizTestCases({solutionId})).rejects.toThrow(
      'missing solutionId',
    )
  })

  test('deleteQuizSolution fn should delete solutions and return count number', async () => {
    prismaMock.solution.deleteMany.mockResolvedValue({count: 4})
    expect(await deleteQuizSolution({quizId: faker.string.uuid()})).toEqual({
      count: 4,
    })
  })

  test('Missing quizId parameter should raise a missing quizId error', async () => {
    const quizId: any = undefined
    prismaMock.solution.deleteMany.mockResolvedValue({count: 4})
    expect(async () => await deleteQuizSolution({quizId})).rejects.toThrow(
      'missing quizId',
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
    ).rejects.toThrow('missing userId')
  })

  test('Missing locale parameter should raise a missing locale error', async () => {
    const locale: any = undefined
    expect(
      async () =>
        await getAllUserQuizzes({
          locale,
          userId: faker.lorem.text(),
        }),
    ).rejects.toThrow('missing locale')
  })

  test('getQuiz fn should return quiz', async () => {
    const quizData: any = {quizId: 1}
    prismaMock.quiz.findUnique.mockResolvedValue(quizData)
    expect(await getQuiz(quizData)).toEqual(quizData)
  })
})
