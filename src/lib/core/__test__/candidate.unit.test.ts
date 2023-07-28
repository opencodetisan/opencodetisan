import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {createCandidateQuizSubmission} from '../candidate'

describe('Candidate module', () => {
  test('createCandidateQuizSubmission fn should save and return the submission data', async () => {
    const submissionData: any = {
      userId: faker.string.uuid(),
      quizId: faker.string.uuid(),
      code: faker.lorem.text(),
    }
    prismaMock.submission.create.mockResolvedValue(submissionData)
    expect(await createCandidateQuizSubmission(submissionData)).toEqual(
      submissionData,
    )
  })

  test('Missing userId parameter should raise an missing userId error', async () => {
    const submissionData: any = {
      // userId: faker.string.uuid(),
      quizId: faker.string.uuid(),
      code: faker.lorem.text(),
    }
    expect(
      async () => await createCandidateQuizSubmission(submissionData),
    ).rejects.toEqual(Error('missing userId'))
  })

  test('Missing quizId parameter should raise an missing quizId error', async () => {
    const submissionData: any = {
      userId: faker.string.uuid(),
      // quizId: faker.string.uuid(),
      code: faker.lorem.text(),
    }
    expect(
      async () => await createCandidateQuizSubmission(submissionData),
    ).rejects.toEqual(Error('missing quizId'))
  })

  test('Missing code parameter should raise an missing code error', async () => {
    const submissionData: any = {
      userId: faker.string.uuid(),
      quizId: faker.string.uuid(),
      // code: faker.lorem.text(),
    }
    expect(
      async () => await createCandidateQuizSubmission(submissionData),
    ).rejects.toEqual(Error('missing code'))
  })
})
