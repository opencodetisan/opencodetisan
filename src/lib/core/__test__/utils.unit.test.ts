import {convertToMinuteSecond} from '@/lib/utils'
import {faker} from '@faker-js/faker'

describe('Candidate module', () => {
  test('createCandidateQuizSubmission fn should save and return the submission data', async () => {
    const data = 1
    expect(convertToMinuteSecond(data)).toEqual({minutes: 0, seconds: 1})
  })
})
