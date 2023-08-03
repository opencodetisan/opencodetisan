import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {
  createCandidateQuizSubmission,
  getActivityLogCount,
  getActivityLogs,
} from '../candidate'

const uuid = faker.string.uuid()
const text = faker.lorem.text()

describe('Candidate module', () => {
  test('createCandidateQuizSubmission fn should save and return the submission data', async () => {
    const submissionData: any = {
      userId: uuid,
      quizId: uuid,
      code: text,
    }
    prismaMock.submission.create.mockResolvedValue(submissionData)
    expect(await createCandidateQuizSubmission(submissionData)).toEqual(
      submissionData,
    )
  })

  test('Missing userId parameter should raise an missing userId error', async () => {
    const submissionData: any = {
      // userId: uuid,
      quizId: uuid,
      code: text,
    }
    expect(
      async () => await createCandidateQuizSubmission(submissionData),
    ).rejects.toThrow(/^missing userId$/)
  })

  test('Missing quizId parameter should raise an missing quizId error', async () => {
    const submissionData: any = {
      userId: uuid,
      // quizId: uuid,
      code: text,
    }
    expect(
      async () => await createCandidateQuizSubmission(submissionData),
    ).rejects.toThrow(/^missing quizId$/)
  })

  test('Missing code parameter should raise an missing code error', async () => {
    const submissionData: any = {
      userId: uuid,
      quizId: uuid,
      // code: text,
    }
    expect(
      async () => await createCandidateQuizSubmission(submissionData),
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
    prismaMock.candidateActivityLog.findMany.mockResolvedValue(param)
    expect(await getActivityLogs(param)).toEqual(param)
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
})
