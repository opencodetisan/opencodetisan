import {convertToMinuteSecond} from '@/lib/utils'
import {faker} from '@faker-js/faker'

describe('Candidate module', () => {
  test('createCandidateQuizSubmission fn should save and return the submission data', async () => {
    const data = 1
    expect(convertToMinuteSecond(data)).toEqual({minutes: 0, seconds: 1})
  })

  test('Missing seconds parameter should raise an missing seconds error', () => {
    const data: any = undefined
    expect(() => convertToMinuteSecond(data)).toThrow(/^missing seconds$/)
  })
})
