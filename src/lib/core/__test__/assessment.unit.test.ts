import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {
  addAssessmentQuizzes,
  createAssessment,
  createAssessmentCandidateEmails,
  deleteAssessmentQuizSubmissions,
  getAssessment,
  getAssessmentCompletedQuiz,
  getAssessmentPoints,
  getAssessmentQuizPoint,
  getAssessmentResult,
  getAssessments,
  updateAssessment,
  updateAssessmentCandidateStatus,
} from '../assessment'

describe('Assessment module', () => {
  test('createAssessment fn should save and return the assessment data', async () => {
    const assessmentData: any = {
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessment.create.mockResolvedValue(assessmentData)
    expect(await createAssessment(assessmentData)).toEqual(assessmentData)
  })

  test('missing userId parameter should return a missing userId error', async () => {
    const assessmentData: any = {
      // userId: faker.string.uuid(),
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }

    prismaMock.assessmentCandidateEmail.create.mockResolvedValue(assessmentData)
    expect(async () => await createAssessment(assessmentData)).rejects.toEqual(
      Error('missing userId'),
    )
  })

  test('missing title parameter should return a missing title error', async () => {
    const assessmentData: any = {
      userId: faker.string.uuid(),
      // title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }

    prismaMock.assessmentCandidateEmail.create.mockResolvedValue(assessmentData)
    expect(async () => await createAssessment(assessmentData)).rejects.toEqual(
      Error('missing title'),
    )
  })

  test('missing description parameter should return a missing description error', async () => {
    const assessmentData: any = {
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      // description: faker.lorem.text(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }

    prismaMock.assessmentCandidateEmail.create.mockResolvedValue(assessmentData)
    expect(async () => await createAssessment(assessmentData)).rejects.toEqual(
      Error('missing description'),
    )
  })

  test('missing quizIds parameter should return a missing quizIds error', async () => {
    const assessmentData: any = {
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      // quizIds: [faker.string.uuid(), faker.string.uuid()],
    }

    prismaMock.assessmentCandidateEmail.create.mockResolvedValue(assessmentData)
    expect(async () => await createAssessment(assessmentData)).rejects.toEqual(
      Error('missing quizIds'),
    )
  })

  test('createAssessmentCandidateEmails fn should save and return the count number', async () => {
    const candidateEmails: any = [
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    prismaMock.assessmentCandidateEmail.createMany.mockResolvedValue(
      candidateEmails,
    )
    expect(await createAssessmentCandidateEmails(candidateEmails)).toEqual(
      candidateEmails,
    )
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const candidateEmails: any = [
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        // assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    prismaMock.assessmentCandidateEmail.createMany.mockResolvedValue(
      candidateEmails,
    )
    expect(
      async () => await createAssessmentCandidateEmails(candidateEmails),
    ).rejects.toEqual(Error('missing assessmentId'))
  })

  test('missing email parameter should return a missing email error', async () => {
    const candidateEmails: any = [
      {
        assessmentId: faker.string.uuid(),
        // email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    prismaMock.assessmentCandidateEmail.createMany.mockResolvedValue(
      candidateEmails,
    )
    expect(
      async () => await createAssessmentCandidateEmails(candidateEmails),
    ).rejects.toEqual(Error('missing email'))
  })

  test('missing statusCode parameter should return a missing statusCode error', async () => {
    const candidateEmails: any = [
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        // statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        // statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    prismaMock.assessmentCandidateEmail.createMany.mockResolvedValue(
      candidateEmails,
    )
    expect(
      async () => await createAssessmentCandidateEmails(candidateEmails),
    ).rejects.toEqual(Error('missing statusCode'))
  })

  test('missing errorMessage parameter should return a missing errorMessage error', async () => {
    const candidateEmails: any = [
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: faker.string.uuid(),
        email: faker.lorem.text(),
        statusCode: 200,
        // errorMessage: faker.lorem.text(),
      },
    ]
    prismaMock.assessmentCandidateEmail.createMany.mockResolvedValue(
      candidateEmails,
    )
    expect(
      async () => await createAssessmentCandidateEmails(candidateEmails),
    ).rejects.toEqual(Error('missing errorMessage'))
  })

  test('updateAssessment fn should save and return the assessment data', async () => {
    const assessmentData: any = {
      assessmentId: faker.string.uuid(),
      title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(assessmentData)
    expect(await updateAssessment(assessmentData)).toEqual(assessmentData)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const assessmentData: any = {
      // assessmentId: faker.string.uuid(),
      title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(assessmentData)
    expect(async () => await updateAssessment(assessmentData)).rejects.toEqual(
      Error('missing assessmentId'),
    )
  })

  test('missing title parameter should return a missing title error', async () => {
    const assessmentData: any = {
      assessmentId: faker.string.uuid(),
      // title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(assessmentData)
    expect(async () => await updateAssessment(assessmentData)).rejects.toEqual(
      Error('missing title'),
    )
  })

  test('missing description parameter should return a missing description error', async () => {
    const assessmentData: any = {
      assessmentId: faker.string.uuid(),
      title: faker.lorem.text(),
      // description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(assessmentData)
    expect(async () => await updateAssessment(assessmentData)).rejects.toEqual(
      Error('missing description'),
    )
  })

  test('updateAssessmentCandidateStatus fn should update and return the assessmentCandidate data', async () => {
    const assessmentCandidateData: any = {
      assessmentId: faker.string.uuid(),
      candidateId: faker.string.uuid(),
    }
    prismaMock.assessmentCandidate.update.mockResolvedValue(
      assessmentCandidateData,
    )
    expect(
      await updateAssessmentCandidateStatus(assessmentCandidateData),
    ).toEqual(assessmentCandidateData)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const assessmentCandidateData: any = {
      // assessmentId: faker.string.uuid(),
      candidateId: faker.string.uuid(),
    }
    prismaMock.assessmentCandidate.update.mockResolvedValue(
      assessmentCandidateData,
    )
    expect(
      async () =>
        await updateAssessmentCandidateStatus(assessmentCandidateData),
    ).rejects.toEqual(Error('missing assessmentId'))
  })

  test('missing candidateId parameter should return a missing candidateId error', async () => {
    const assessmentCandidateData: any = {
      assessmentId: faker.string.uuid(),
      // candidateId: faker.string.uuid(),
    }
    prismaMock.assessmentCandidate.update.mockResolvedValue(
      assessmentCandidateData,
    )
    expect(
      async () =>
        await updateAssessmentCandidateStatus(assessmentCandidateData),
    ).rejects.toEqual(Error('missing candidateId'))
  })

  test('addAssessmentQuizzes fn should add quizzes and return the count number', async () => {
    const assessmentQuizData: any = {
      assessmentId: faker.string.uuid(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(await addAssessmentQuizzes(assessmentQuizData)).toEqual(
      assessmentQuizData,
    )
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const assessmentQuizData: any = {
      // assessmentId: faker.string.uuid(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toEqual(Error('missing assessmentId'))
  })

  test('missing quizIds parameter should return a missing quizIds error', async () => {
    const assessmentQuizData: any = {
      assessmentId: faker.string.uuid(),
      // quizIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toEqual(Error('missing quizIds'))
  })

  test('Empty quizIds array should return a 0 quizId found error', async () => {
    const assessmentQuizData: any = {
      assessmentId: faker.string.uuid(),
      quizIds: [],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toEqual(Error('0 quizId found'))
  })

  test('getAssessmentResult fn should return the assessmentResult', async () => {
    const assessmentResultData: any = {
      assessmentId: faker.string.uuid(),
      quizId: faker.string.uuid(),
    }
    prismaMock.assessmentResult.findFirst.mockResolvedValue(
      assessmentResultData,
    )
    expect(await getAssessmentResult(assessmentResultData)).toEqual(
      assessmentResultData,
    )
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const assessmentResultData: any = {
      // assessmentId: faker.string.uuid(),
      quizId: faker.string.uuid(),
    }
    prismaMock.assessmentResult.findFirst.mockResolvedValue(
      assessmentResultData,
    )
    expect(
      async () => await getAssessmentResult(assessmentResultData),
    ).rejects.toEqual(Error('missing assessmentId'))
  })

  test('missing quizId parameter should return a missing quizId error', async () => {
    const assessmentResultData: any = {
      assessmentId: faker.string.uuid(),
      // quizId: faker.string.uuid(),
    }
    prismaMock.assessmentResult.findFirst.mockResolvedValue(
      assessmentResultData,
    )
    expect(
      async () => await getAssessmentResult(assessmentResultData),
    ).rejects.toEqual(Error('missing quizId'))
  })

  test('deleteAssessmentQuizSubmissions fn should delete and return the count number', async () => {
    const data: any = {
      submissionIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessmentQuizSubmission.deleteMany.mockResolvedValue({count: 2})
    expect(await deleteAssessmentQuizSubmissions(data)).toEqual({
      count: 2,
    })
  })

  test('missing submissionIds parameter should return a missing submissionIds error', async () => {
    const data: any = {
      submissionIds: undefined,
    }
    prismaMock.assessmentQuizSubmission.deleteMany.mockResolvedValue({count: 2})
    expect(
      async () => await deleteAssessmentQuizSubmissions(data),
    ).rejects.toEqual(Error('missing submissionIds'))
  })

  test('empty submissionIds array should return null', async () => {
    const data: any = {
      submissionIds: [],
    }
    prismaMock.assessmentQuizSubmission.deleteMany.mockResolvedValue({count: 2})
    expect(await deleteAssessmentQuizSubmissions(data)).toBe(null)
  })

  test('getAssessments fn should return the assessments', async () => {
    const data: any = {
      userId: faker.string.uuid(),
    }
    prismaMock.assessment.findMany.mockResolvedValue(data)
    expect(await getAssessments(data)).toEqual(data)
  })

  test('missing userId parameter should return a missing userId error', async () => {
    const data: any = {
      userId: undefined,
    }
    expect(async () => await getAssessments(data)).rejects.toEqual(
      Error('missing userId'),
    )
  })

  test('getAssessment fn should return the assessment', async () => {
    const data: any = {
      assessmentId: faker.string.uuid(),
    }
    prismaMock.assessment.findUnique.mockResolvedValue(data)
    expect(await getAssessment(data)).toEqual(data)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const data: any = {
      // assessmentId: faker.string.uuid(),
    }
    expect(async () => await getAssessment(data)).rejects.toEqual(
      Error('missing assessmentId'),
    )
  })

  test('getAssessmentCompletedQuiz fn should return the assessmentResult', async () => {
    const data: any = {
      assessmentId: faker.string.uuid(),
    }
    prismaMock.assessmentResult.findMany.mockResolvedValue(data)
    expect(await getAssessmentCompletedQuiz(data)).toEqual(data)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const data: any = {
      // assessmentId: faker.string.uuid(),
    }
    expect(async () => await getAssessmentCompletedQuiz(data)).rejects.toEqual(
      Error('missing assessmentId'),
    )
  })

  test('getAssessmentPoints fn should return the assessmentResult', async () => {
    const data: any = [{name: 'point', point: 1, id: '1'}]
    prismaMock.assessmentPoint.findMany.mockResolvedValue(data)
    expect(await getAssessmentPoints()).toEqual({
      point: {point: 1, id: '1'},
    })
  })

  test('getAssessmentQuizPoint fn should return the assessmentResult', async () => {
    const assessmentPointData: any = {
      easyQuizCompletionPoint: {point: 1, id: '1111'},
      speedPoint: {point: 1, id: '2222'},
    }
    const data = {
      assessmentQuizzes: [
        {
          quiz: {
            difficultyLevel: {
              name: 'easy',
            },
            id: 'quiz1',
            title: 'Two sum',
            instruction: 'Just do it',
            difficultyLevelId: 1,
          },
        },
      ],
      assessmentPoints: assessmentPointData,
    }
    prismaMock.assessmentPoint.findMany.mockResolvedValue(assessmentPointData)
    expect(await getAssessmentQuizPoint(data)).toEqual({
      totalPoint: 2.2,
      quizPoints: {quiz1: 2.2},
      assignedQuizzes: [
        {
          difficultyLevel: {
            name: 'easy',
          },
          difficultyLevelId: 1,
          id: 'quiz1',
          instruction: 'Just do it',
          title: 'Two sum',
        },
      ],
    })
  })

  test('missing assessmentQuizzes parameter should return a missing assessmentQuizzes error', async () => {
    const assessmentPointData: any = {
      easyQuizCompletionPoint: {point: 1, id: '1111'},
      speedPoint: {point: 1, id: '2222'},
    }
    const data: any = {
      assessmentPoints: assessmentPointData,
    }
    await expect(
      async () => await getAssessmentQuizPoint(data),
    ).rejects.toEqual(Error('missing assessmentQuizzes'))
  })

  test('empty assessmentQuizzes should return a assessmentQuizzes is empty error', async () => {
    const assessmentPointData: any = {
      easyQuizCompletionPoint: {point: 1, id: '1111'},
      speedPoint: {point: 1, id: '2222'},
    }
    const data: any = {
      assessmentQuizzes: [],
      assessmentPoints: assessmentPointData,
    }
    expect(async () => await getAssessmentQuizPoint(data)).rejects.toEqual(
      Error('assessmentQuizzes is empty'),
    )
  })
})
