import {faker} from '@faker-js/faker'
import {prismaMock} from '../../db/prisma-mock-singleton'
import {createAssessment} from '../assessment'

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
})
