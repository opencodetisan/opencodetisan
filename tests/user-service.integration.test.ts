import {
  initPassRecoveryService,
  recoverPasswordService,
} from '@/lib/core/service'
import {getPasswordRecoveryToken} from '@/lib/core/user'
import prisma from '@/lib/db/client'
import {faker} from '@faker-js/faker'
import {DateTime} from 'luxon'

jest.mock('nodemailer')
import nodemailer from 'nodemailer'

const sendMailMock = jest.fn()
// TODO: fix type error
// @ts-ignore
nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock})

const number = faker.number.int()
const text = faker.lorem.text()

const nodemailerResponse = {
  accepted: ['example@gmail.com'],
  rejected: [],
  ehlo: [],
  envelopeTime: number,
  messageTime: number,
  messageSize: number,
  response: text,
  envelope: {from: 'example@gmail.com', to: ['example@gmail.com']},
  messageId: text,
}

describe('Integration test: User', () => {
  describe('Integration test: recoverPasswordService', () => {
    const word = faker.lorem.word()
    const userId_1 = faker.string.uuid()
    const userId_2 = faker.string.uuid()
    const email_1 = faker.internet.email()
    const email_2 = faker.internet.email()
    const plainTextPassword = 'password'
    const token_1 = 'token_1'
    const token_2 = 'token_2'
    const past = DateTime.now().minus({minutes: 5}).toJSDate()
    const future = DateTime.now().plus({minutes: 5}).toJSDate()

    beforeAll(async () => {
      await prisma.user.create({
        data: {
          id: userId_1,
          name: word,
          email: email_1,
          userKey: {create: {password: 'example1'}},
          passwordRecoveryToken: {
            create: {token: token_1, expiredAt: future},
          },
        },
      })
      await prisma.user.create({
        data: {
          id: userId_2,
          email: email_2,
          userKey: {create: {password: 'example2'}},
          passwordRecoveryToken: {
            create: {token: token_2, expiredAt: past},
          },
        },
      })
    })

    afterAll(async () => {
      await prisma.passwordRecoveryToken.deleteMany({
        where: {token: {in: [token_1, token_2]}},
      })
      await prisma.userKey.deleteMany({
        where: {userId: {in: [userId_1, userId_2]}},
      })
      await prisma.user.deleteMany({
        where: {id: {in: [userId_1, userId_2]}},
      })
    })

    test('it should update the token status and user password', async () => {
      await recoverPasswordService({
        password: plainTextPassword,
        token: token_1,
      })
      await recoverPasswordService({
        password: plainTextPassword,
        token: token_2,
      })
      const userKey_1 = await prisma.userKey.findUnique({
        where: {userId: userId_1},
        select: {
          user: {select: {passwordRecoveryToken: {where: {token: token_1}}}},
          password: true,
        },
      })
      const userKey_2 = await prisma.userKey.findUnique({
        where: {userId: userId_2},
        select: {
          user: {select: {passwordRecoveryToken: {where: {token: token_2}}}},
          password: true,
        },
      })

      expect(userKey_1?.password).toMatch('$2b$10$')
      expect(userKey_1?.user.passwordRecoveryToken[0].isRecovered).toBe(true)
      expect(userKey_2?.password).toBe('example2')
      expect(userKey_2?.user.passwordRecoveryToken[0].isRecovered).toBe(false)
    })
  })

  describe('Integration test: initPassRecoveryService', () => {
    const word = faker.lorem.word()
    const userId_1 = faker.string.uuid()
    const email_1 = faker.internet.email()
    const email_2 = faker.internet.email()

    beforeAll(async () => {
      sendMailMock.mockClear()
      // TODO: fix type error
      // @ts-ignore
      nodemailer.createTransport.mockClear()

      await prisma.user.create({
        data: {
          id: userId_1,
          name: word,
          email: email_1,
        },
      })
    })

    afterAll(async () => {
      await prisma.passwordRecoveryToken.deleteMany({where: {userId: userId_1}})
      await prisma.user.deleteMany({
        where: {id: {in: [userId_1]}},
      })
    })

    test('it should store new password recovery token and send an e-mail', async () => {
      sendMailMock.mockResolvedValue(nodemailerResponse)

      const passwordRecovery_1 = await initPassRecoveryService({
        email: email_1,
        expiredInSeconds: 300,
      })
      const passwordRecovery_2 = await initPassRecoveryService({
        email: email_2,
        expiredInSeconds: 300,
      })
      const passwordRecoveryToken = await getPasswordRecoveryToken({
        token: passwordRecovery_1?.token as string,
      })

      const tokenCreatedAt = DateTime.fromJSDate(
        passwordRecoveryToken?.createdAt as Date,
      )
      const tokenExpiredAt = DateTime.fromJSDate(
        passwordRecoveryToken?.expiredAt as Date,
      )
      const diffInMinutes = tokenExpiredAt
        .diff(tokenCreatedAt, 'minutes')
        .toObject()

      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
      expect(passwordRecovery_1?.emailStatus).toEqual(nodemailerResponse)
      expect(passwordRecovery_1?.token).toEqual(passwordRecoveryToken?.token)
      expect(diffInMinutes.minutes).toBeCloseTo(5)
      expect(passwordRecovery_2).toBeNull()
    })
  })
})
