import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {
  addAssessmentQuizzes,
  createAssessment,
  createAssessmentCandidateEmails,
  deleteAssessmentQuiz,
  deleteAssessmentQuizSubmissions,
  getAssessment,
  getAssessmentComparativeScore,
  getAssessmentComparativeScoreLevel,
  getAssessmentCompletedQuiz,
  getAssessmentPoints,
  getAssessmentQuizPoint,
  deleteAssessmentResult,
  getAssessmentResult,
  getAssessmentUsersBelowPointCount,
  getAssessmentUsersCount,
  getAssessments,
  updateAssessment,
  updateAssessmentCandidateStatus,
  getAssessmentIds,
  getAssessmentQuizzes,
  updateAssessmentAcceptance,
} from '../assessment'
import {AssessmentStatus} from '@prisma/client'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

const mockAssessment = {
  id: uuid,
  ownerId: uuid,
  title: text,
  description: text,
  createdAt: date,
}
const mockAssessments = Array(2).fill(mockAssessment)

const mockAssessmentCandidateEmail = {
  id: uuid,
  email: text,
  statusCode: number,
  errorMessage: text,
  assessmentId: uuid,
}
const mockAssessmentCandidateEmails = Array(2).fill(
  mockAssessmentCandidateEmail,
)

const mockAssessmentCandidate = {
  assessmentId: uuid,
  candidateId: uuid,
  status: AssessmentStatus.COMPLETED,
  token: uuid,
}

describe('Assessment module', () => {
  test('createAssessment fn should save and return the assessment data', async () => {
    const param: any = {
      userId: uuid,
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [uuid, uuid],
    }
    prismaMock.assessment.create.mockResolvedValue(mockAssessment)
    expect(await createAssessment(param)).toEqual(mockAssessment)
  })

  test('missing userId parameter should return a missing userId error', async () => {
    const param: any = {
      // userId: uuid,
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [uuid, uuid],
    }
    expect(async () => await createAssessment(param)).rejects.toEqual(
      Error('missing userId'),
    )
  })

  test('missing title parameter should return a missing title error', async () => {
    const param: any = {
      userId: uuid,
      // title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [uuid, uuid],
    }
    expect(async () => await createAssessment(param)).rejects.toEqual(
      Error('missing title'),
    )
  })

  test('missing description parameter should return a missing description error', async () => {
    const param: any = {
      userId: uuid,
      title: faker.lorem.text(),
      // description: faker.lorem.text(),
      quizIds: [uuid, uuid],
    }
    expect(async () => await createAssessment(param)).rejects.toEqual(
      Error('missing description'),
    )
  })

  test('missing quizIds parameter should return a missing quizIds error', async () => {
    const param: any = {
      userId: uuid,
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      // quizIds: [uuid, uuid],
    }
    expect(async () => await createAssessment(param)).rejects.toEqual(
      Error('missing quizIds'),
    )
  })

  test('createAssessmentCandidateEmails fn should save and return the count number', async () => {
    const param: any = [
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    prismaMock.assessmentCandidateEmail.createMany.mockResolvedValue({
      count: number,
    })
    expect(await createAssessmentCandidateEmails(param)).toEqual({
      count: number,
    })
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const param: any = [
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        // assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    expect(
      async () => await createAssessmentCandidateEmails(param),
    ).rejects.toThrow(/^missing assessmentId$/)
  })

  test('missing email parameter should return a missing email error', async () => {
    const param: any = [
      {
        assessmentId: uuid,
        // email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    expect(
      async () => await createAssessmentCandidateEmails(param),
    ).rejects.toThrow(/^missing email$/)
  })

  test('missing statusCode parameter should return a missing statusCode error', async () => {
    const param: any = [
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        // statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        // statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
    ]
    expect(
      async () => await createAssessmentCandidateEmails(param),
    ).rejects.toThrow(/^missing statusCode$/)
  })

  test('missing errorMessage parameter should return a missing errorMessage error', async () => {
    const param: any = [
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        errorMessage: faker.lorem.text(),
      },
      {
        assessmentId: uuid,
        email: faker.lorem.text(),
        statusCode: 200,
        // errorMessage: faker.lorem.text(),
      },
    ]
    expect(
      async () => await createAssessmentCandidateEmails(param),
    ).rejects.toThrow(/^missing errorMessage$/)
  })

  test('updateAssessment fn should save and return the assessment data', async () => {
    const param: any = {
      assessmentId: uuid,
      title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    prismaMock.assessment.update.mockResolvedValue(mockAssessment)
    expect(await updateAssessment(param)).toEqual(mockAssessment)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const param: any = {
      // assessmentId: uuid,
      title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    expect(async () => await updateAssessment(param)).rejects.toEqual(
      Error('missing assessmentId'),
    )
  })

  test('missing title parameter should return a missing title error', async () => {
    const param: any = {
      assessmentId: uuid,
      // title: faker.lorem.text(),
      description: faker.lorem.text(),
    }
    expect(async () => await updateAssessment(param)).rejects.toEqual(
      Error('missing title'),
    )
  })

  test('missing description parameter should return a missing description error', async () => {
    const param: any = {
      assessmentId: uuid,
      title: faker.lorem.text(),
      // description: faker.lorem.text(),
    }
    expect(async () => await updateAssessment(param)).rejects.toEqual(
      Error('missing description'),
    )
  })

  test('updateAssessmentCandidateStatus fn should update and return the assessmentCandidate data', async () => {
    const assessmentCandidateData: any = {
      assessmentId: uuid,
      candidateId: uuid,
    }
    prismaMock.assessmentCandidate.update.mockResolvedValue(
      mockAssessmentCandidate,
    )
    expect(
      await updateAssessmentCandidateStatus(assessmentCandidateData),
    ).toEqual(mockAssessmentCandidate)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const assessmentCandidateData: any = {
      // assessmentId: uuid,
      candidateId: uuid,
    }
    expect(
      async () =>
        await updateAssessmentCandidateStatus(assessmentCandidateData),
    ).rejects.toThrow(/^missing assessmentId$/)
  })

  test('missing candidateId parameter should return a missing candidateId error', async () => {
    const assessmentCandidateData: any = {
      assessmentId: uuid,
      // candidateId: uuid,
    }
    expect(
      async () =>
        await updateAssessmentCandidateStatus(assessmentCandidateData),
    ).rejects.toThrow(/^missing candidateId$/)
  })

  test('addAssessmentQuizzes fn should add quizzes and return the count number', async () => {
    const assessmentQuizData: any = {
      assessmentId: uuid,
      quizIds: [uuid, uuid],
    }
    prismaMock.assessmentQuiz.createMany.mockResolvedValue(assessmentQuizData)
    expect(await addAssessmentQuizzes(assessmentQuizData)).toEqual(
      assessmentQuizData,
    )
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const assessmentQuizData: any = {
      // assessmentId: uuid,
      quizIds: [uuid, uuid],
    }
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toThrow(/^missing assessmentId$/)
  })

  test('missing quizIds parameter should return a missing quizIds error', async () => {
    const assessmentQuizData: any = {
      assessmentId: uuid,
      // quizIds: [uuid, uuid],
    }
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toThrow(/^missing quizIds$/)
  })

  test('Empty quizIds array should return a 0 quizId found error', async () => {
    const assessmentQuizData: any = {
      assessmentId: uuid,
      quizIds: [],
    }
    expect(
      async () => await addAssessmentQuizzes(assessmentQuizData),
    ).rejects.toThrow(/^0 quizId found$/)
  })

  test('getAssessmentResult fn should return the assessmentResult', async () => {
    const assessmentResultData: any = {
      assessmentId: uuid,
      quizId: uuid,
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
      // assessmentId: uuid,
      quizId: uuid,
    }
    expect(
      async () => await getAssessmentResult(assessmentResultData),
    ).rejects.toThrow(/^missing assessmentId$/)
  })

  test('missing quizId parameter should return a missing quizId error', async () => {
    const assessmentResultData: any = {
      assessmentId: uuid,
      // quizId: uuid,
    }
    expect(
      async () => await getAssessmentResult(assessmentResultData),
    ).rejects.toThrow(/^missing quizId$/)
  })

  test('deleteAssessmentQuizSubmissions fn should delete and return the count number', async () => {
    const data: any = {
      submissionIds: [uuid, uuid],
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
    expect(
      async () => await deleteAssessmentQuizSubmissions(data),
    ).rejects.toThrow(/^missing submissionIds$/)
  })

  test('empty submissionIds array should return null', async () => {
    const data: any = {
      submissionIds: [],
    }
    expect(await deleteAssessmentQuizSubmissions(data)).toBe(null)
  })

  test('getAssessments fn should return the assessments', async () => {
    const data: any = {
      userId: uuid,
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
      assessmentId: uuid,
    }
    prismaMock.assessment.findUnique.mockResolvedValue(mockAssessment)
    expect(await getAssessment(data)).toEqual(mockAssessment)
  })

  test('deleteAssessmentResult fn should delete and return assessmentResult', async () => {
    const data: any = {
      assessmentResultId: uuid,
    }
    prismaMock.assessmentResult.delete.mockResolvedValue(data)
    expect(await deleteAssessmentResult(data)).toEqual(data)
  })

  test('missing assessmentResultId parameter should return a missing assessmentResultId error', async () => {
    const data: any = {
      assessmentResultId: undefined,
    }
    expect(async () => await deleteAssessmentResult(data)).rejects.toThrow(
      'missing assessmentResultId',
    )
  })

  test('deleteAssessmentQuiz fn should delete and return assessmentResult', async () => {
    const data: any = {
      assessmentId: uuid,
      quizId: uuid,
    }
    prismaMock.assessmentQuiz.delete.mockResolvedValue(data)
    expect(await deleteAssessmentQuiz(data)).toEqual(data)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const data: any = {
      // assessmentId: uuid,
      quizId: uuid,
    }
    expect(async () => await deleteAssessmentQuiz(data)).rejects.toThrow(
      'missing assessmentId',
    )
  })

  test('sendAssessmentEmail fn should delete and return assessmentResult', async () => {
    // const data: any = {
    //   locale: faker.lorem.word(),
    //   recipient: faker.lorem.word(),
    //   assessmentUrl: faker.lorem.word(),
    //   companyName: faker.lorem.word(),
    // }
    // expect(await sendAssessmentEmail(data)).toBe(1)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const data: any = {
      // assessmentId: uuid,
    }
    expect(async () => await getAssessment(data)).rejects.toEqual(
      Error('missing assessmentId'),
    )
  })

  test('getAssessmentCompletedQuiz fn should return the assessmentResult', async () => {
    const data: any = {
      assessmentId: uuid,
    }
    prismaMock.assessmentResult.findMany.mockResolvedValue(data)
    expect(await getAssessmentCompletedQuiz(data)).toEqual(data)
  })

  test('missing assessmentId parameter should return a missing assessmentId error', async () => {
    const data: any = {
      // assessmentId: uuid,
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
    ).rejects.toThrow(/^missing assessmentQuizzes$/)
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

  test('missing assessmentPoints should return a missing assessmentPoints error', async () => {
    const data: any = {
      assessmentQuizzes: [''],
    }
    expect(async () => await getAssessmentQuizPoint(data)).rejects.toEqual(
      Error('missing assessmentPoints'),
    )
  })

  test('getAssessmentComparativeScore fn should return the comparativeScore and usersBelowPointCount', async () => {
    const data: any = {
      usersCount: 0,
      usersBelowPointCount: 0,
      point: 100,
    }
    expect(await getAssessmentComparativeScore(data)).toEqual({
      comparativeScore: 100,
      usersBelowPointCount: 0,
    })
  })

  test('missing usersCount param should return a missing usersCount error', async () => {
    const data: any = {
      // usersCount: 0,
      usersBelowPointCount: 0,
      point: 100,
    }
    expect(
      async () => await getAssessmentComparativeScore(data),
    ).rejects.toThrow(/^missing usersCount$/)
  })

  test('missing usersBelowPointCount param should return a missing usersBelowPointCount error', async () => {
    const data: any = {
      usersCount: 0,
      // usersBelowPointCount: 0,
      point: 100,
    }
    expect(
      async () => await getAssessmentComparativeScore(data),
    ).rejects.toThrow(/^missing usersBelowPointCount$/)
  })

  test('missing point param should return a missing point error', async () => {
    const data: any = {
      usersCount: 0,
      usersBelowPointCount: 0,
      // point: 100,
    }
    expect(
      async () => await getAssessmentComparativeScore(data),
    ).rejects.toThrow(/^missing point$/)
  })

  test('getAssessmentComparativeScoreLevel fn should return the comparativeScore level', async () => {
    const data: any = {
      comparativeScore: 0,
    }
    expect(getAssessmentComparativeScoreLevel(data)).toBe('low')
  })

  test('missing comparativeScore param should return a missing comparativeScore error', async () => {
    const data: any = {
      comparativeScore: undefined,
    }
    expect(() => getAssessmentComparativeScoreLevel(data)).toThrow(
      /^missing comparativeScore$/,
    )
  })

  test('getAssessmentUsersCount fn should return the usersCount', async () => {
    const data: any = {
      userId: uuid,
      quizId: uuid,
    }
    prismaMock.quizPointCollection.count.mockResolvedValue(10)
    expect(await getAssessmentUsersCount(data)).toBe(10)
  })

  test('missing userId param should return a missing userId error', async () => {
    const data: any = {
      // userId: uuid,
      quizId: uuid,
    }
    expect(async () => await getAssessmentUsersCount(data)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('missing quizId param should return a missing quizId error', async () => {
    const data: any = {
      userId: uuid,
      // quizId: uuid,
    }
    expect(async () => await getAssessmentUsersCount(data)).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('getAssessmentUsersBelowPointCount fn should return the usersCount', async () => {
    const data: any = {
      userId: uuid,
      quizId: uuid,
      point: 10,
    }
    prismaMock.quizPointCollection.count.mockResolvedValue(10)
    expect(await getAssessmentUsersBelowPointCount(data)).toBe(10)
  })

  test('missing quizId param should return a missing quizId error', async () => {
    const data: any = {
      userId: uuid,
      // quizId: uuid,
      point: 10,
    }
    expect(
      async () => await getAssessmentUsersBelowPointCount(data),
    ).rejects.toThrow(/^missing quizId$/)
  })

  test('missing userId param should return a missing userId error', async () => {
    const data: any = {
      // userId: uuid,
      quizId: uuid,
      point: 10,
    }
    expect(
      async () => await getAssessmentUsersBelowPointCount(data),
    ).rejects.toThrow(/^missing userId$/)
  })

  test('missing point param should return a missing point error', async () => {
    const data: any = {
      userId: uuid,
      quizId: uuid,
      // point: 10,
    }
    expect(
      async () => await getAssessmentUsersBelowPointCount(data),
    ).rejects.toThrow(/^missing point$/)
  })

  test('getAssessmentIds fn should return an array of ids', async () => {
    const param: any = {
      userId: uuid,
    }
    prismaMock.assessment.findMany.mockResolvedValue(mockAssessments)
    expect(await getAssessmentIds(param)).toEqual([uuid, uuid])
  })

  test('missing point param should return a missing point error', async () => {
    const param: any = {
      // userId: uuid,
    }
    expect(async () => await getAssessmentIds(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('getAssessmentQuizzes fn should return assessment quizzes', async () => {
    const param: any = {
      assessmentId: uuid,
    }
    prismaMock.assessmentQuiz.findMany.mockResolvedValue(param)
    expect(await getAssessmentQuizzes(param)).toEqual(param)
  })

  test('missing assessmentId param should return a missing assessmentId error', async () => {
    const param: any = {}
    expect(async () => await getAssessmentQuizzes(param)).rejects.toThrow(
      /^missing assessmentId$/,
    )
  })

  test('updateAssessmentAcceptance fn should update and return assessment', async () => {
    const param: any = {
      assessmentId: uuid,
      candidateId: uuid,
      assessmentResults: [
        {candidateId: uuid, quizId: uuid},
        {candidateId: uuid, quizId: uuid},
      ],
      token: uuid,
    }
    prismaMock.assessment.update.mockResolvedValue(mockAssessment)
    expect(await updateAssessmentAcceptance(param)).toEqual(mockAssessment)
  })

  test('missing assessmentId param should return a missing assessmentId error', async () => {
    const param: any = {
      // assessmentId: uuid,
      candidateId: uuid,
      assessmentResults: [
        {candidateId: uuid, quizId: uuid},
        {candidateId: uuid, quizId: uuid},
      ],
      token: uuid,
    }
    expect(async () => await updateAssessmentAcceptance(param)).rejects.toThrow(
      /^missing assessmentId$/,
    )
  })

  test('missing candidateId param should return a missing candidateId error', async () => {
    const param: any = {
      assessmentId: uuid,
      // candidateId: uuid,
      assessmentResults: [
        {candidateId: uuid, quizId: uuid},
        {candidateId: uuid, quizId: uuid},
      ],
      token: uuid,
    }
    expect(async () => await updateAssessmentAcceptance(param)).rejects.toThrow(
      /^missing candidateId$/,
    )
  })

  test('missing assessmentResults param should return a missing assessmentResults error', async () => {
    const param: any = {
      assessmentId: uuid,
      candidateId: uuid,
      // assessmentResults: [
      //   {candidateId: uuid, quizId: uuid},
      //   {candidateId: uuid, quizId: uuid},
      // ],
      token: uuid,
    }
    expect(async () => await updateAssessmentAcceptance(param)).rejects.toThrow(
      /^missing assessmentResults$/,
    )
  })

  test('empty assessmentResults param should return a empty assessmentResults error', async () => {
    const param: any = {
      assessmentId: uuid,
      candidateId: uuid,
      assessmentResults: [],
      token: uuid,
    }
    expect(async () => await updateAssessmentAcceptance(param)).rejects.toThrow(
      /^empty assessmentResults$/,
    )
  })

  test('missing token param should return a missing token error', async () => {
    const param: any = {
      assessmentId: uuid,
      candidateId: uuid,
      assessmentResults: [
        {candidateId: uuid, quizId: uuid},
        {candidateId: uuid, quizId: uuid},
      ],
      // token: uuid,
    }
    expect(async () => await updateAssessmentAcceptance(param)).rejects.toThrow(
      /^missing token$/,
    )
  })
})
