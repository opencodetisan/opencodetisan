import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {createAssessment, createAssessmentCandidateEmails} from '../assessment'

describe('Assessment module', () => {
  test(' saveUserQuizSubmission fn should save and return the submission data', async () => {
    const assessmentData: any = {
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      quizIds: [faker.string.uuid(), faker.string.uuid()],
    }
    prismaMock.assessment.create.mockResolvedValue(assessmentData)
    expect(await createAssessment(assessmentData)).toEqual(assessmentData)
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
})
