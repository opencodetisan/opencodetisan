import {readdir, rm, unlink} from 'fs/promises'
import {
  createDir,
  getLocalFiles,
  readSessionReplay,
  writeSessionReplay,
} from '../analytic'
import {faker} from '@faker-js/faker'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()
const filenames = ['assessmentQuizSubId_1', 'assessmentQuizSubId_2']

const rmFiles = async ({userId}: {userId: string}) => {
  const files = await readdir(`./src/session/${userId}/`)
  const deleteFilePromises = files.map((file) =>
    unlink(`./src/session/${userId}/${file}`),
  )
  await Promise.all(deleteFilePromises)
}

const userId = 'user1'
const assessmentQuizSubId = 'test'

describe('Analytic module', () => {
  describe('writeSessionReplay should create a new local session-replay file', () => {
    const fakeData = [{message: 'Hello World'}]
    beforeAll(async () => {
      for (let i = 0; i < 1; i++) {
        await writeSessionReplay({data: fakeData, userId, assessmentQuizSubId})
      }
    })
    afterAll(async () => {
      await rmFiles({userId})
    })

    test('Should the stored session-replay be the same as input', async () => {
      const param: any = {
        userId,
        assessmentQuizSubId,
        data: fakeData,
      }
      const pathToFile = await writeSessionReplay({
        data: fakeData,
        userId,
        assessmentQuizSubId,
      })
      expect(await readSessionReplay({pathToFile})).toEqual(fakeData)
    })

    // test('Should the data be decompress from binary format', async () => {
    //   const param: any = {pathToFile: fakePath}
    //   expect(await readSessionReplay(param)).toEqual(fakeData)
    // })
    //
    // test('Should save with conventional filename', async () => {
    //   const param: any = {pathToFile: fakePath}
    //   expect(await readSessionReplay(param)).toEqual(fakeData)
    // })
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
    expect(await readSessionReplay(param)).toEqual('Hello World')
  })

  test('Missing pathToFile parameter should raise an missing pathToFile error', async () => {
    const param: any = {}
    expect(async () => await readSessionReplay(param)).rejects.toThrow(
      /^missing pathToFile$/,
    )
  })
})
