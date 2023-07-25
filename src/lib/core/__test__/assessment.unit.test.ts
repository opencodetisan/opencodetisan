import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {
  createAssessment,
  createAssessmentCandidateEmails,
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
})
