import {access, readdir, rm, unlink} from 'fs/promises'
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
    beforeEach(async () => {
      for (let i = 0; i < 2; i++) {
        await writeSessionReplay({data: fakeData, userId, assessmentQuizSubId})
      }
    })
    afterEach(async () => {
      await rmFiles({userId})
    })

    test('Should the stored session-replay be the same as input', async () => {
      const pathToFile = await writeSessionReplay({
        data: fakeData,
        userId,
        assessmentQuizSubId,
      })
      expect(await readSessionReplay({userId, assessmentQuizSubId})).toEqual([
        {message: 'Hello World'},
        {message: 'Hello World'},
        {message: 'Hello World'},
      ])
    })

    test('Should the stored session-replay file have the correct index', async () => {
      const pathToFile = await writeSessionReplay({
        data: fakeData,
        userId,
        assessmentQuizSubId,
      })
      expect(pathToFile.split('_')[1]).toBe('3')
    })

    test('Should the new session-replay file be accesible', async () => {
      const pathToFile = await writeSessionReplay({
        data: fakeData,
        userId,
        assessmentQuizSubId,
      })
      try {
        await access(pathToFile)
        expect(true).toBe(true)
      } catch (error) {
        expect(true).toBe(false)
      }
    })
  })

  test('Missing data parameter should return a missing data error', async () => {
    const param: any = {
      // data: {message: 'Hello'},
      userId: uuid,
      assessmentQuizSubId: uuid,
    }
    expect(async () => await writeSessionReplay(param)).rejects.toThrow(
      /^missing data$/,
    )
  })

  test('Missing userId parameter should return a missing userId error', async () => {
    const param: any = {
      data: {message: 'Hello'},
      // userId: uuid,
      assessmentQuizSubId: uuid,
    }
    expect(async () => await writeSessionReplay(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('Missing assessmentQuizSubId parameter should return a missing assessmentQuizSubId error', async () => {
    const param: any = {
      data: {message: 'Hello'},
      userId: uuid,
      // assessmentQuizSubId: uuid,
    }
    expect(async () => await writeSessionReplay(param)).rejects.toThrow(
      /^missing assessmentQuizSubId$/,
    )
  })

  describe('readSessionReplay should return the expected JSON', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 3; i++) {
        const fakeData = [{i}]
        await writeSessionReplay({
          data: fakeData,
          userId,
          assessmentQuizSubId,
        })
      }
    })
    afterEach(async () => {
      await rmFiles({userId})
    })

    test('Should return the expected JSON', async () => {
      expect(await readSessionReplay({userId, assessmentQuizSubId})).toEqual([
        {i: 1},
        {i: 2},
        {i: 3},
      ])
    })
  })

  test('Missing assessmentQuizSubId parameter should return a missing assessmentQuizSubId error', async () => {
    const param: any = {
      userId: uuid,
      // assessmentQuizSubId: uuid,
    }
    expect(async () => await writeSessionReplay(param)).rejects.toThrow(
      /^missing assessmentQuizSubId$/,
    )
  })
})
