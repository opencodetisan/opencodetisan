import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {createAssessment, createAssessmentCandidateEmails} from '../assessment'

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
})
