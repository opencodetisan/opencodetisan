import {
  ICreateQuizProps,
  ICreateQuizSolutionProps,
  ICreateQuizSubmissionProps,
  ICreateQuizTestCaseProps,
  IQuizDataProps,
  IQuizProps,
  IQuizSolutionProps,
  IQuizTestCaseProps,
  ITestCaseClientProps,
  ITestCaseProps,
  IUpdateQuizProps,
  IUpdateQuizSolutionProps,
  IUpdateQuizTestCaseProps,
} from '@/types/index'
import prisma from '@/lib/db/client'

export const createQuiz = async (quizData: ICreateQuizProps) => {
  if (!quizData.title) {
    throw Error('missing quiz title')
  } else if (!quizData.codeLanguageId) {
    throw Error('missing codeLanguageId')
  } else if (!quizData.userId) {
    throw Error('missing userId')
  } else if (!quizData.difficultyLevelId) {
    throw Error('missing difficultyLevelId')
  } else if (!quizData.instruction) {
    throw Error('missing instruction')
  } else if (!quizData.answer) {
    throw Error('missing answer')
  } else if (!quizData.defaultCode) {
    throw Error('missing defaultCode')
  } else if (!quizData.locale) {
    throw Error('missing locale')
  }
  const quiz = await prisma.quiz.create({data: quizData})
  return quiz
}

export const createQuizSolution = async (
  solutionData: ICreateQuizSolutionProps,
) => {
  if (!solutionData.quizId) {
    throw Error('missing quizId')
  } else if (!solutionData.code) {
    throw Error('missing code')
  } else if (typeof solutionData.sequence !== 'number') {
    throw Error('missing sequence')
  } else if (!solutionData.importDirectives) {
    throw Error('missing importDirectives')
  } else if (!solutionData.testRunner) {
    throw Error('missing testRunner')
  }
  const solution = await prisma.solution.create({
    data: solutionData,
  })
  return solution
}

export const createQuizTestCase = async (
  testCase: ICreateQuizTestCaseProps,
) => {
  if (!testCase.solutionId) {
    throw Error('missing solutionId')
  } else if (!testCase.input) {
    throw Error('missing input')
  } else if (!testCase.output) {
    throw Error('missing output')
  } else if (typeof testCase.sequence !== 'number') {
    throw Error('missing sequence')
  }

  const result = await prisma.testCase.create({data: testCase})

  return result
}

export const createQuizSubmission = async ({
  userId,
  quizId,
  code,
}: ICreateQuizSubmissionProps) => {
  if (!userId) {
    throw Error('missing userId')
  } else if (!quizId) {
    throw Error('missing quizId')
  } else if (!code) {
    throw Error('missing code')
  }

  const submission = await prisma.submission.create({
    data: {
      userId,
      quizId,
      code,
    },
    include: {
      quiz: {
        include: {
          difficultyLevel: true,
        },
      },
    },
  })
  return submission
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
    throw Error('missing quizId')
  } else if (!userId) {
    throw Error('missing userId')
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
    throw Error('missing solutionId')
  } else if (!code) {
    throw Error('missing code')
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

export const getQuizTestCases = async ({solutionId}: {solutionId: string}) => {
  if (!solutionId) {
    throw Error('missing solutionId')
  }
  const testCases = await prisma.testCase.findMany({
    where: {
      solutionId,
    },
    orderBy: {
      sequence: 'asc',
    },
  })
  return testCases
}

export const updateQuizTestCase = async ({
  testCaseId,
  input,
  output,
}: IUpdateQuizTestCaseProps) => {
  if (!testCaseId) {
    throw Error('missing testCaseId')
  } else if (!input) {
    throw Error('missing input')
  } else if (!output) {
    throw Error('missing output')
  }
  const testCase = await prisma.testCase.update({
    where: {
      id: testCaseId,
    },
    data: {
      input: input,
      output: output,
    },
  })

  return testCase
}

export const getSolutionAndTestId = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw Error('missing quizId')
  }

  let output: {solutionId: string[]; testCaseId: string[]} = {
    solutionId: [],
    testCaseId: [],
  }

  const quiz = await prisma.quiz.findUnique({
    where: {id: quizId},
    select: {solutions: {select: {id: true, testCases: {select: {id: true}}}}},
  })

  if (!quiz) {
    return {}
  }

  // TODO: Replace any type with a proper type
  quiz.solutions.forEach((solution: Record<string, any>) => {
    output.solutionId.push(solution.id)

    // TODO: Replace any type with a proper type
    solution.testCases.forEach((test: Record<string, any>) => {
      output.testCaseId.push(test.id)
    })
  })

  return output
}

export const deleteQuizTestCases = async ({
  testCaseId,
}: {
  testCaseId: string
}) => {
  if (!testCaseId) {
    throw Error('missing testCaseId')
  }
  const testCase = await prisma.testCase.delete({where: {id: testCaseId}})
  return testCase
}

export const deleteQuizSolution = async ({
  solutionId,
}: {
  solutionId: string
}) => {
  if (!solutionId) {
    throw Error('missing solutionId')
  }
  const solution = await prisma.solution.delete({where: {id: solutionId}})
  return solution
}

export const deleteQuiz = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw Error('missing quizId')
  }
  const result = await prisma.quiz.delete({where: {id: quizId}})
  return result
}

export const getQuizSolutionIds = async ({quizId}: {quizId: string}) => {
  if (!quizId) {
    throw Error('missing quizId')
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
    throw Error('missing userId')
  } else if (!locale) {
    throw Error('missing locale')
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
    throw Error('missing quizId')
  }

  let output: IQuizProps = {quizData: {}, quizSolution: [], quizTestCase: []}

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      codeLanguage: true,
      solutions: {
        orderBy: {sequence: 'asc'},
        include: {
          testCases: {
            orderBy: {
              sequence: 'asc',
            },
          },
        },
      },
    },
  })

  if (!quiz) {
    return {}
  }

  for (const prop in quiz) {
    if (prop !== 'solutions') {
      // TODO
      // @ts-ignore
      output.quizData[prop] = quiz[prop]
    }
  }

  // TODO: Replace any type with a proper type
  quiz.solutions.forEach((solution: Record<string, any>) => {
    const quizSolution: IQuizSolutionProps = {
      quizId: '',
      id: '',
      importDirectives: '',
      code: '',
      sequence: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      testRunner: '',
    }

    for (const prop in solution) {
      if (prop !== 'testCases') {
        // TODO
        // @ts-ignore
        quizSolution[prop] = solution[prop]
      }
    }
    output.quizSolution.push(quizSolution)
    solution.testCases.forEach((test: IQuizTestCaseProps) =>
      output.quizTestCase.push(test),
    )
  })

  return output
}

export const getCodeRunnerResult = async ({
  code,
  testRunner,
  language,
}: {
  code: string
  testRunner: string
  language: 'javascript' | 'python' | 'c' | 'cpp' | 'java'
}) => {
  // edit the codeRunnerUrl according to ur origin
  const codeRunnerUrl = 'http://localhost:3001/api/test'

  const fetch = require("node-fetch")
    const getRunResult = await fetch(
      codeRunnerUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code, 
          testRunner,
          language,
        }),
      },
    )

    const runResult = await getRunResult.json()
    try {
      const parsedRunResult = JSON.parse(runResult.data)
      const status:boolean[] = []
    
      for(let i = 0; i < parsedRunResult.expected.length; i++) {
        status.push(parsedRunResult.expected[i] === parsedRunResult.actual[i])
      }
      const result = status.every((value) => value === true)

      return {
        result: result,
        status: status,
        actual: parsedRunResult.actual,
        expected: parsedRunResult.expected,
      }  
    } catch (e) {
      return {
        message: runResult.data
      }
    }
}