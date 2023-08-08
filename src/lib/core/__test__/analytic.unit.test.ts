import {rm} from 'fs/promises'
import {getLocalFiles, readLocalFile, writeLocalFile} from '../analytic'
import {faker} from '@faker-js/faker'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()
const filenames = ['assessmentQuizSubId_1', 'assessmentQuizSubId_2']

const rmFile = async ({path}: {path: string}) => {
  rm(path)
}

describe('Analytic module', () => {
  describe('creating a new local file', () => {
    const fakePath = 'test_1'
    const fakeData = [{message: 'Hello World'}]

    afterEach(() => rmFile({path: fakePath}))

    test('writeLocalFile fn should create and store data in a new local file', async () => {
      const param: any = {path: fakePath, data: fakeData}
      // expect(await writeLocalFile(param)).toEqual('Hello World')
    })
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
    expect(async () => await readLocalFile(param)).rejects.toThrow(
      /^missing pathToFile$/,
    )
  })
})
