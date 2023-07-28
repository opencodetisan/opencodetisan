import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {createCandidateQuizSubmission} from '../candidate'

describe('Candidate module', () => {
  test(' saveUserQuizSubmission fn should save and return the submission data', async () => {
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
})
