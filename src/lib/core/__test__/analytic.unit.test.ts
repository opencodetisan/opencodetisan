import {getLocalFiles, readLocalFile, writeLocalFile} from '@/lib/utils'
import {faker} from '@faker-js/faker'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

const filenames = ['assessmentQuizSubId_1', 'assessmentQuizSubId_2']

describe('Analytic module', () => {
  test('writeLocalFile fn should create and store data in a new local file', async () => {
    const param = {path: text, data: text}
    expect(await writeLocalFile(param)).toEqual('Hello World')
  })

  test('Missing path param should raise an missing path error', async () => {
    const param: any = {data: text}
    expect(async () => await readLocalFile(param)).rejects.toThrow(
      /^missing path$/,
    )
  })

  test('Missing data param should raise an missing data error', async () => {
    const param: any = {path: text}
    expect(async () => await readLocalFile(param)).rejects.toThrow(
      /^missing data$/,
    )
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

  test('readLocalFile fn should return file data', async () => {
    const param = {pathToFile: text}
    expect(await readLocalFile(param)).toEqual('Hello World')
  })

  test('Missing pathToFile parameter should raise an missing pathToFile error', async () => {
    const param: any = {}
    expect(async () => await readLocalFile(param)).toThrow(
      /^missing pathToFile$/,
    )
  })
})
