import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {
  addAssessmentQuizzes,
  createAssessment,
  createAssessmentCandidateEmails,
  deleteAssessmentQuizSubmissions,
  getAssessmentResult,
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
    expect(async () => await createAssessment(assessmentData)).rejects.toThrow(
      'missing userId',
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
    expect(async () => await createAssessment(assessmentData)).rejects.toThrow(
      'missing title',
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
    expect(async () => await createAssessment(assessmentData)).rejects.toThrow(
      'missing description',
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
    expect(async () => await createAssessment(assessmentData)).rejects.toThrow(
      'missing quizIds',
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
    ).rejects.toThrow('missing assessmentId')
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
    ).rejects.toThrow('missing email')
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
    ).rejects.toThrow('missing statusCode')
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
    ).rejects.toThrow('missing errorMessage')
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
    expect(async () => await updateAssessment(assessmentData)).rejects.toThrow(
      'missing assessmentId',
    )
  })

  test('missing title parameter should return a missing title error', async () => {
    const assessmentData: any = {
      assessmentId: faker.string.uuid(),
      // title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(assessmentData)
    expect(async () => await updateAssessment(assessmentData)).rejects.toThrow(
      'missing title',
    )
  })

  test('missing description parameter should return a missing description error', async () => {
    const assessmentData: any = {
      assessmentId: faker.string.uuid(),
      title: faker.lorem.text(),
      // description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(assessmentData)
    expect(async () => await updateAssessment(assessmentData)).rejects.toThrow(
      'missing description',
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
    ).rejects.toThrow('missing assessmentId')
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
    ).rejects.toThrow('missing candidateId')
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
    ).rejects.toThrow('missing assessmentId')
  })

  test('missing quizIds parameter should return a missing quizIds error', async () => {
    const assessmentQuizData: any = {
      assessmentId: faker.string.uuid(),
      // quizIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toThrow('missing quizIds')
  })

  test('Empty quizIds array should return a 0 quizId found error', async () => {
    const assessmentQuizData: any = {
      assessmentId: faker.string.uuid(),
      quizIds: [],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toThrow('0 quizId found')
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
    ).rejects.toThrow('missing assessmentId')
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
    ).rejects.toThrow('missing quizId')
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
    ).rejects.toThrow('missing submissionIds')
  })
})
