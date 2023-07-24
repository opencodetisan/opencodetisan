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
