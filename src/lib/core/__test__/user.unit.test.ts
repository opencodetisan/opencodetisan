import {faker} from '@faker-js/faker'
import {prismaMock} from '@/lib/db/prisma-mock-singleton'
import {createUserToken, getUserByEmail, getUserForAuth} from '../user'
import {UserRole} from '@/enums'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

const user = {
  id: uuid,
  name: text,
  email: text,
  emailVerified: null,
  image: null,
  role: UserRole.User,
}

describe('User module', () => {
  test('createUserToken function should save the new password recovery token', async () => {
    const param: any = {
      email: text,
      token: text,
      expiredAt: date,
    }
    prismaMock.user.update.mockResolvedValue(user)
    const savedQuiz = await createUserToken(param)
    expect(savedQuiz).toEqual(user)
  })

  test('Missing email parameter should raise an missing email error', async () => {
    const param: any = {
      // email: text,
      token: text,
      expiredAt: date,
    }
    expect(async () => await createUserToken(param)).rejects.toThrow(
      /^missing email$/,
    )
  })

  test('Missing token parameter should raise an missing token error', async () => {
    const param: any = {
      email: text,
      // token: text,
      expiredAt: date,
    }
    expect(async () => await createUserToken(param)).rejects.toThrow(
      /^missing token$/,
    )
  })

  test('Missing expiredAt parameter should raise an missing expiredAt error', async () => {
    const param: any = {
      email: text,
      token: text,
      // expiredAt: date,
    }
    expect(async () => await createUserToken(param)).rejects.toThrow(
      /^missing expiredAt$/,
    )
  })

  test('getUserByEmail function should return user by email', async () => {
    const param: any = {
      email: text,
    }
    prismaMock.user.findUnique.mockResolvedValue(user)
    const result = await getUserByEmail(param)
    expect(result).toEqual(user)
  })

  test('Missing email parameter should raise an missing email error', async () => {
    const param: any = {
      // email: text,
    }
    expect(async () => await getUserByEmail(param)).rejects.toThrow(
      /^missing email$/,
    )
  })

  test('getUserforAuth function should return user by email', async () => {
    const param: any = {
      email: text,
    }
    prismaMock.user.findUnique.mockResolvedValue(user)
    const result = await getUserForAuth(param)
    expect(result).toEqual(user)
  })

  test('Missing email parameter should raise an missing email error', async () => {
    const param: any = {
      // email: text,
    }
    expect(async () => await getUserForAuth(param)).rejects.toThrow(
      /^missing email$/,
    )
  })
})
