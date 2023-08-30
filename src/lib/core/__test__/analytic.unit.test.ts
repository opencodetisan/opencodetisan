import {access, rm} from 'fs/promises'
import {
  getAssessmentComparativeScore,
  getAssessmentComparativeScoreLevel,
  getAssessmentPoints,
  getAssessmentQuizPoint,
  getAssessmentUsersBelowPointCount,
  getAssessmentUsersCount,
  readSessionReplay,
  writeSessionReplay,
} from '../analytic'
import {faker} from '@faker-js/faker'
import {prismaMock} from '@/lib/db/prisma-mock-singleton'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

const userId = 'user1'
const assessmentQuizSubId = 'test'

const mockAssessmentPoint = {
  id: uuid,
  name: text,
  point: number,
}
const mockAssessmentPoints = Array(2).fill(mockAssessmentPoint)

describe('Analytic module', () => {
  describe('writeSessionReplay should create a new local session-replay file', () => {
    const fakeData = [{message: 'Hello World'}]
    beforeEach(async () => {
      for (let i = 0; i < 2; i++) {
        await writeSessionReplay({data: fakeData, userId, assessmentQuizSubId})
      }
    })
    afterEach(async () => {
      await rm(`./src/session/${userId}`, {recursive: true, force: true})
    })

    test('Should the stored session-replay be the same as input', async () => {
      await writeSessionReplay({
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
      await rm(`./src/session/${userId}`, {recursive: true, force: true})
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
    expect(async () => await readSessionReplay(param)).rejects.toThrow(
      /^missing assessmentQuizSubId$/,
    )
  })

  test('Missing userId parameter should return a missing userId error', async () => {
    const param: any = {
      // userId: uuid,
      assessmentQuizSubId: uuid,
    }
    expect(async () => await readSessionReplay(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('getAssessmentPoints fn should return the assessmentResult', async () => {
    const data: any = [{name: 'point', point: 1, id: '1'}]
    const expected: any = {}
    mockAssessmentPoints.forEach((obj) => {
      expected[obj.name] = {point: obj.point, id: obj.id}
    })
    prismaMock.assessmentPoint.findMany.mockResolvedValue(mockAssessmentPoints)
    expect(await getAssessmentPoints()).toEqual(expected)
  })

  test('getAssessmentQuizPoint fn should return the assessmentResult', async () => {
    const assessmentPointData: any = {
      easyQuizCompletionPoint: {point: 1, id: '1111'},
      speedPoint: {point: 1, id: '2222'},
    }
    const data = {
      assessmentQuizzes: [
        {
          quiz: {
            difficultyLevel: {
              name: 'easy',
            },
            id: 'quiz1',
            title: 'Two sum',
            instruction: 'Just do it',
            difficultyLevelId: 1,
          },
        },
      ],
      assessmentPoints: assessmentPointData,
    }
    prismaMock.assessmentPoint.findMany.mockResolvedValue(mockAssessmentPoints)
    expect(await getAssessmentQuizPoint(data)).toEqual({
      totalPoint: 2.2,
      quizPoints: {quiz1: 2.2},
      assignedQuizzes: [
        {
          difficultyLevel: {
            name: 'easy',
          },
          difficultyLevelId: 1,
          id: 'quiz1',
          instruction: 'Just do it',
          title: 'Two sum',
        },
      ],
    })
  })

  test('missing assessmentQuizzes parameter should return a missing assessmentQuizzes error', async () => {
    const assessmentPointData: any = {
      easyQuizCompletionPoint: {point: 1, id: '1111'},
      speedPoint: {point: 1, id: '2222'},
    }
    const data: any = {
      assessmentPoints: assessmentPointData,
    }
    await expect(
      async () => await getAssessmentQuizPoint(data),
    ).rejects.toThrow(/^missing assessmentQuizzes$/)
  })

  test('empty assessmentQuizzes should return a assessmentQuizzes is empty error', async () => {
    const assessmentPointData: any = {
      easyQuizCompletionPoint: {point: 1, id: '1111'},
      speedPoint: {point: 1, id: '2222'},
    }
    const data: any = {
      assessmentQuizzes: [],
      assessmentPoints: assessmentPointData,
    }
    expect(async () => await getAssessmentQuizPoint(data)).rejects.toEqual(
      Error('assessmentQuizzes is empty'),
    )
  })

  test('missing assessmentPoints should return a missing assessmentPoints error', async () => {
    const data: any = {
      assessmentQuizzes: [''],
    }
    expect(async () => await getAssessmentQuizPoint(data)).rejects.toEqual(
      Error('missing assessmentPoints'),
    )
  })

  test('getAssessmentComparativeScore fn should return the comparativeScore and usersBelowPointCount', () => {
    const data: any = {
      usersCount: 0,
      usersBelowPointCount: 0,
      point: 100,
    }
    expect(getAssessmentComparativeScore(data)).toBe(100)
  })

  test('missing usersCount param should return a missing usersCount error', async () => {
    const data: any = {
      // usersCount: 0,
      usersBelowPointCount: 0,
      point: 100,
    }
    expect(() => getAssessmentComparativeScore(data)).toThrow(
      /^missing usersCount$/,
    )
  })

  test('missing usersBelowPointCount param should return a missing usersBelowPointCount error', async () => {
    const data: any = {
      usersCount: 0,
      // usersBelowPointCount: 0,
      point: 100,
    }
    expect(() => getAssessmentComparativeScore(data)).toThrow(
      /^missing usersBelowPointCount$/,
    )
  })

  test('missing point param should return a missing point error', async () => {
    const data: any = {
      usersCount: 0,
      usersBelowPointCount: 0,
      // point: 100,
    }
    expect(() => getAssessmentComparativeScore(data)).toThrow(/^missing point$/)
  })

  test('getAssessmentComparativeScoreLevel fn should return the comparativeScore level', async () => {
    const data: any = {
      comparativeScore: 0,
    }
    expect(getAssessmentComparativeScoreLevel(data)).toBe('low')
  })

  test('missing comparativeScore param should return a missing comparativeScore error', async () => {
    const data: any = {
      comparativeScore: undefined,
    }
    expect(() => getAssessmentComparativeScoreLevel(data)).toThrow(
      /^missing comparativeScore$/,
    )
  })

  test('getAssessmentUsersCount fn should return the usersCount', async () => {
    const data: any = {
      userId: uuid,
      quizId: uuid,
    }
    prismaMock.quizPointCollection.count.mockResolvedValue(10)
    expect(await getAssessmentUsersCount(data)).toBe(10)
  })

  test('missing userId param should return a missing userId error', async () => {
    const data: any = {
      // userId: uuid,
      quizId: uuid,
    }
    expect(async () => await getAssessmentUsersCount(data)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('missing quizId param should return a missing quizId error', async () => {
    const data: any = {
      userId: uuid,
      // quizId: uuid,
    }
    expect(async () => await getAssessmentUsersCount(data)).rejects.toThrow(
      /^missing quizId$/,
    )
  })

  test('getAssessmentUsersBelowPointCount fn should return the usersCount', async () => {
    const data: any = {
      userId: uuid,
      quizId: uuid,
      point: 10,
    }
    prismaMock.quizPointCollection.count.mockResolvedValue(10)
    expect(await getAssessmentUsersBelowPointCount(data)).toBe(10)
  })

  test('missing quizId param should return a missing quizId error', async () => {
    const data: any = {
      userId: uuid,
      // quizId: uuid,
      point: 10,
    }
    expect(
      async () => await getAssessmentUsersBelowPointCount(data),
    ).rejects.toThrow(/^missing quizId$/)
  })

  test('missing userId param should return a missing userId error', async () => {
    const data: any = {
      // userId: uuid,
      quizId: uuid,
      point: 10,
    }
    expect(
      async () => await getAssessmentUsersBelowPointCount(data),
    ).rejects.toThrow(/^missing userId$/)
  })

  test('missing point param should return a missing point error', async () => {
    const data: any = {
      userId: uuid,
      quizId: uuid,
      // point: 10,
    }
    expect(
      async () => await getAssessmentUsersBelowPointCount(data),
    ).rejects.toThrow(/^missing point$/)
  })
})
