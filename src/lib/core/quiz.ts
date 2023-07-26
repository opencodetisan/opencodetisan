import {
  ICreateQuizProps,
  ICreateQuizSolutionProps,
  ICreateQuizTestCaseProps,
  ITestCaseProps,
  IUpdateQuizProps,
  IUpdateQuizSolutionProps,
} from '@/types/index'
import prisma from '@/lib/db/client'

export const createQuiz = async (quizData: ICreateQuizProps) => {
  if (!quizData.title) {
    throw new Error('missing quiz title')
  } else if (!quizData.codeLanguageId) {
    throw new Error('missing code language id')
  } else if (!quizData.userId) {
    throw new Error('missing user id')
  } else if (!quizData.difficultyLevelId) {
    throw new Error('missing difficulty level id')
  } else if (!quizData.instruction) {
    throw new Error('missing instruction')
  } else if (!quizData.answer) {
    throw new Error('missing answer')
  } else if (!quizData.defaultCode) {
    throw new Error('missing default code')
  } else if (!quizData.locale) {
    throw new Error('missing locale')
  }
  const quiz = await prisma.quiz.create({data: quizData})
  return quiz
}

export const createQuizSolution = async (
  solutionData: ICreateQuizSolutionProps,
) => {
  if (!solutionData.quizId) {
    throw new Error('missing quiz id')
  } else if (!solutionData.code) {
    throw new Error('missing code')
  } else if (!solutionData.sequence) {
    throw new Error('missing sequence')
  } else if (!solutionData.importDirectives) {
    throw new Error('missing import directives')
  } else if (!solutionData.testRunner) {
    throw new Error('missing test runner')
  }
  const solution = await prisma.solution.create({
    data: solutionData,
  })
  return solution
}

export const createQuizTestCases = async (
  testCaseData: ICreateQuizTestCaseProps[],
) => {
  if (!testCaseData || testCaseData.length === 0) {
    throw new Error('test case not found')
  }
  let missingField
  const hasAllProps = testCaseData.every((testCase) => {
    return ['solutionId', 'input', 'output', 'sequence'].every((prop) => {
      if (!Object.hasOwn(testCase, prop)) {
        missingField = prop
        return false
      }
      return true
    })
  })
  if (!hasAllProps) {
    throw new Error(`test case missing ${missingField}`)
  }
  const testCases = await prisma.testCase.createMany({data: testCaseData})
  return testCases
}

export const updateQuiz = async ({
  id,
  userId,
  instruction,
  title,
  codeLanguageId,
  difficultyLevelId,
}: IUpdateQuizProps) => {
  if (!id) {
    throw new Error('missing quiz id')
  } else if (!userId) {
    throw new Error('missing user id')
  }
  const updatedQuiz = await prisma.quiz.update({
    where: {id, userId},
    data: {
      instruction,
      title,
      codeLanguageId,
      difficultyLevelId,
    },
  })
  return updatedQuiz
}

export const updateQuizSolution = async ({
  solutionId,
  code,
  importDirectives,
  testRunner,
  defaultCode,
}: IUpdateQuizSolutionProps) => {
  if (!solutionId) {
    throw new Error('missing solutionId')
  } else if (!code) {
    throw new Error('missing code')
  }
  const updatedSolution = await prisma.solution.update({
    where: {
      id: solutionId,
    },
    data: {
      code,
      importDirectives,
      testRunner,
      quiz: {
        update: {
          defaultCode,
        },
      },
    },
  })
  return updatedSolution
}

export const updateQuizTestCases = async ({
  existingTests,
  tests,
}: {
  existingTests: ITestCaseProps[]
  tests: any
}) => {
  if (!existingTests || existingTests.length === 0) {
    throw new Error('missing existing test cases')
  } else if (!tests) {
    throw new Error('missing new test cases')
  }
  let i = -1
  const txn = await prisma.$transaction(
    existingTests.map((test: any) => {
      i++
      return prisma.testCase.update({
        where: {
          id: test.id,
        },
        data: {
          input: tests.input[i],
          output: tests.output[i],
        },
      })
    }),
  )
  return txn
}

export const deleteQuizTestCases = async ({
  solutionId,
}: {
  solutionId: string
}) => {
  if (!solutionId) {
    throw new Error('missing solutionId')
  }
  const result = await prisma.testCase.deleteMany({where: {solutionId}})
  return result
}

export const deleteQuizSolution = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw new Error('missing quizId')
  }
  const result = await prisma.solution.deleteMany({where: {quizId}})
  return result
}

export const deleteQuiz = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw new Error('missing quizId')
  }
  const result = await prisma.quiz.delete({where: {id: quizId}})
  return result
}

export const getQuizSolutionIds = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw new Error('missing quizId')
  }
  const solutionIds = await prisma.quiz.findUnique({
    where: {id: quizId},
    select: {solutions: {select: {id: true}}},
  })
  return solutionIds
}

export const getAllUserQuizzes = async ({
  userId,
  locale,
}: {
  userId: string
  locale: string
}) => {
  if (!userId) {
    throw new Error('missing userId')
  } else if (!locale) {
    throw new Error('missing locale')
  }
  const quizzes = await prisma.quiz.findMany({
    where: {
      userId,
      locale: locale as string,
    },
    select: {
      id: true,
      title: true,
      submissionCachedCount: true,
      difficultyLevelId: true,
      codeLanguageId: true,
      user: {
        select: {
          name: true,
        },
      },
      status: true,
      codeLanguage: {
        select: {
          id: true,
          prettyName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return quizzes
}

export const getQuiz = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw new Error('missing quizId')
  }
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
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
          //entryFunction: true,
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
  return quiz
}
