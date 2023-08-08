import {convertToMinuteSecond, getLocalFiles} from '@/lib/utils'
import {faker} from '@faker-js/faker'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

const filenames = ['assessmentQuizSubId_1', 'assessmentQuizSubId_2']

describe('Candidate module', () => {
  test('createCandidateQuizSubmission fn should save and return the submission data', async () => {
    const data = 1
    expect(convertToMinuteSecond(data)).toEqual({minutes: 0, seconds: 1})
  })

  test('Missing seconds parameter should raise an missing seconds error', () => {
    const data: any = undefined
    expect(() => convertToMinuteSecond(data)).toThrow(/^missing seconds$/)
  })

  test('getLocalFiles fn should return an array of filenames', async () => {
    const param = {userId: 'userId', assessmentQuizSubId: 'assessmentQuizSubId'}
    expect(await getLocalFiles(param)).toEqual(filenames)
  })

  test('Missing userId parameter should raise an missing userId error', async () => {
    const param: any = {assessmentQuizSubId: 'assessmentQuizSubId'}
    expect(async () => await getLocalFiles(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('Missing assessmentQuizSubId parameter should raise an missing assessmentQuizSubId error', async () => {
    const param: any = {userId: 'userId'}
    expect(async () => await getLocalFiles(param)).toThrow(
      /^missing assessmentQuizSubId$/,
    )
  })
})
