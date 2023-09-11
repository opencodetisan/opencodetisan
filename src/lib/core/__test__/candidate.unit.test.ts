import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {
  createCandidateQuizSubmission,
  createNewQuizAttempt,
  getActivityLogCount,
  getActivityLogs,
  getCandidate,
  getCandidateResult,
} from '../candidate'
import {createCandidatePoint} from '../analytic'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

const mockSubmission = {
  id: uuid,
  userId: uuid,
  quizId: uuid,
  code: text,
  createdAt: date,
  updatedAt: date,
}

const mockCandidateActivityLog = {
  id: uuid,
  createdAt: date,
  userId: uuid,
  assessmentId: uuid,
  userActionId: number,
}
const mockCandidateActivityLogs = new Array(2).map(() => {
  return mockCandidateActivityLog
})

const candidateResultMock = {
  assessmentResults: [
    {
      id: uuid,
      quizId: uuid,
      assessmentId: uuid,
      candidateId: uuid,
      timeTaken: 0,
      status: 'PENDING',
      assessmentQuizSubmissions: [],
    },
  ],
}

const assessmentCandidateMock = {
  assessmentId: uuid,
  candidateId: uuid,
  status: 'PENDING',
  token: uuid,
}

describe('Candidate module', () => {
  test('createCandidateQuizSubmission fn should save and return the submission data', async () => {
    const param: any = {
      userId: uuid,
      quizId: uuid,
      code: text,
    }
    prismaMock.submission.create.mockResolvedValue(mockSubmission)
    expect(await createCandidateQuizSubmission(param)).toEqual(mockSubmission)
  })

  test('Missing userId parameter should raise an missing userId error', async () => {
    const param: any = {
      // userId: uuid,
      quizId: uuid,
      code: text,
    }
    expect(
      async () => await createCandidateQuizSubmission(param),
    ).rejects.toThrow(/^missing userId$/)
  })

  test('Missing quizId parameter should raise an missing quizId error', async () => {
    const param: any = {
      userId: uuid,
      // quizId: uuid,
      code: text,
    }
    expect(
      async () => await createCandidateQuizSubmission(param),
    ).rejects.toThrow(/^missing quizId$/)
  })

  test('Missing code parameter should raise an missing code error', async () => {
    const param: any = {
      userId: uuid,
      quizId: uuid,
      // code: text,
    }
    expect(
      async () => await createCandidateQuizSubmission(param),
    ).rejects.toThrow(/^missing code$/)
  })

  test('getActivityLogCount fn should return the count number', async () => {
    const param: any = {
      assessmentIds: [uuid, uuid],
    }
    const prismaMockValue = 5
    prismaMock.candidateActivityLog.count.mockResolvedValue(prismaMockValue)
    expect(await getActivityLogCount(param)).toBe(prismaMockValue)
  })

  test('Missing assessmentIds parameter should raise an missing assessmentIds error', async () => {
    const param: any = {}
    expect(async () => await getActivityLogCount(param)).rejects.toThrow(
      /^missing assessmentIds$/,
    )
  })

  test('Empty assessmentIds should raise an empty assessmentIds error', async () => {
    const param: any = {
      assessmentIds: [],
    }
    expect(async () => await getActivityLogCount(param)).rejects.toThrow(
      /^empty assessmentIds$/,
    )
  })

  test('getActivityLogs fn should return activity logs', async () => {
    const param: any = {
      assessmentIds: [uuid, uuid],
    }
    prismaMock.candidateActivityLog.findMany.mockResolvedValue(
      mockCandidateActivityLogs,
    )
    expect(await getActivityLogs(param)).toEqual(mockCandidateActivityLogs)
  })

  test('Missing assessmentIds parameter should raise an missing assessmentIds error', async () => {
    const param: any = {}
    expect(async () => await getActivityLogs(param)).rejects.toThrow(
      /^missing assessmentIds$/,
    )
  })

  test('Empty assessmentIds should raise an empty assessmentIds error', async () => {
    const param: any = {
      assessmentIds: [],
    }
    expect(async () => await getActivityLogs(param)).rejects.toThrow(
      /^empty assessmentIds$/,
    )
  })

  test('getCandidateResult fn should return candidate result', async () => {
    const param: any = {
      assessmentId: uuid,
      quizId: uuid,
      userId: uuid,
    }
    prismaMock.assessment.findUnique.mockResolvedValue(
      candidateResultMock as any,
    )
    expect(await getCandidateResult(param)).toEqual(candidateResultMock)
  })

  test('Missing assessmentId should raise a missing assessmentId error', async () => {
    const param: any = {
      // assessmentId: uuid,
      quizId: uuid,
      userId: uuid,
    }
    expect(async () => await getCandidateResult(param)).rejects.toThrow(
      /^missing assessmentId$/,
    )
  })

  test('Missing quizId should raise a missing quizId error', async () => {
    const param: any = {
      assessmentId: uuid,
      // quizId: uuid,
      userId: uuid,
    }
    expect(async () => await getCandidateResult(param)).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('Missing userId should raise a missing userId error', async () => {
    const param: any = {
      assessmentId: uuid,
      quizId: uuid,
      // userId: uuid,
    }
    expect(async () => await getCandidateResult(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('createNewQuizAttempt fn should create and return candidate result', async () => {
    const param: any = {
      assessmentResultId: uuid,
    }
    prismaMock.assessmentResult.update.mockResolvedValue(
      candidateResultMock as any,
    )
    expect(await createNewQuizAttempt(param)).toEqual(candidateResultMock)
  })

  test('Missing assessmentResultId should raise a missing assessmentResultId error', async () => {
    const param: any = {}
    expect(async () => await createNewQuizAttempt(param)).rejects.toThrow(
      /^missing assessmentResultId$/,
    )
  })

  test('getCandidate fn should return candidate data', async () => {
    const param: any = {
      assessmentId: uuid,
      candidateId: uuid,
    }
    prismaMock.assessmentCandidate.findUnique.mockResolvedValue(
      assessmentCandidateMock as any,
    )
    expect(await getCandidate(param)).toEqual(assessmentCandidateMock)
  })

  test('Missing assessmentId should raise a missing assessmentId error', async () => {
    const param: any = {
      // assessmentId: uuid,
      candidateId: uuid,
    }
    expect(async () => await getCandidate(param)).rejects.toThrow(
      /^missing assessmentId$/,
    )
  })

  test('Missing candidateId should raise a missing candidateId error', async () => {
    const param: any = {
      assessmentId: uuid,
      // candidateId: uuid,
    }
    expect(async () => await getCandidate(param)).rejects.toThrow(
      /^missing candidateId$/,
    )
  })

  test('createCandidatePoint fn should create and return submission', async () => {
    const param: any = {
      submissionId: uuid,
      userId: uuid,
      quizId: uuid,
      totalPoint: number,
      submissionPoint: number,
    }
    prismaMock.submission.update.mockResolvedValue(mockSubmission)
    expect(await createCandidatePoint(param)).toEqual(mockSubmission)
  })

  test('Missing submissionId should raise a missing submissionId error', async () => {
    const param: any = {
      // submissionId: uuid,
      userId: uuid,
      quizId: uuid,
      totalPoint: number,
      submissionPoint: number,
    }
    expect(async () => await createCandidatePoint(param)).rejects.toThrow(
      /^missing submissionId$/,
    )
  })

  test('Missing userId should raise a missing userId error', async () => {
    const param: any = {
      submissionId: uuid,
      // userId: uuid,
      quizId: uuid,
      totalPoint: number,
      submissionPoint: number,
    }
    expect(async () => await createCandidatePoint(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('Missing quizId should raise a missing quizId error', async () => {
    const param: any = {
      submissionId: uuid,
      userId: uuid,
      // quizId: uuid,
      totalPoint: number,
      submissionPoint: number,
    }
    expect(async () => await createCandidatePoint(param)).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('Missing totalPoint should raise a missing totalPoint error', async () => {
    const param: any = {
      submissionId: uuid,
      userId: uuid,
      quizId: uuid,
      // totalPoint: number,
      submissionPoint: number,
    }
    expect(async () => await createCandidatePoint(param)).rejects.toThrow(
      /^missing totalPoint$/,
    )
  })

  test('Missing submissionPoint should raise a missing submissionPoint error', async () => {
    const param: any = {
      submissionId: uuid,
      userId: uuid,
      quizId: uuid,
      totalPoint: number,
      // submissionPoint: number,
    }
    expect(async () => await createCandidatePoint(param)).rejects.toThrow(
      /^missing submissionPoint$/,
    )
  })
})
