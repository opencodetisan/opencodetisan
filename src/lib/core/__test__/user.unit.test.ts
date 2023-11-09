import {faker} from '@faker-js/faker'
import {prismaMock} from '@/lib/db/prisma-mock-singleton'
import {
  createUser,
  createUserToken,
  deleteUser,
  deleteUserKey,
  getPasswordRecoveryToken,
  getUserByEmail,
  getUserForAuth,
  updateUserPassword,
} from '../user'
import {UserRole} from '@/enums'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()
const email_1 = faker.internet.email()

const user = {
  id: uuid,
  name: text,
  email: text,
  emailVerified: null,
  image: null,
  role: UserRole.Recruiter,
}

const userKey = {
  id: uuid,
  userId: uuid,
  password: text,
}

const passwordRecoveryToken = {
  id: uuid,
  token: uuid,
  isRecovered: true,
  createdAt: date,
  expiredAt: date,
  userId: uuid,
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

  test('updateUserPassword function should update user password and return token data', async () => {
    const param: any = {
      token: uuid,
      hashedPassword: text,
    }
    prismaMock.passwordRecoveryToken.update.mockResolvedValue(
      passwordRecoveryToken,
    )
    const result = await updateUserPassword(param)
    expect(result).toEqual(passwordRecoveryToken)
  })

  test('Missing token parameter should raise an missing token error', async () => {
    const param: any = {
      // token: uuid,
      hashedPassword: text,
    }
    expect(async () => await updateUserPassword(param)).rejects.toThrow(
      /^missing token$/,
    )
  })

  test('Missing password parameter should raise an missing password error', async () => {
    const param: any = {
      token: uuid,
      // password: text,
    }
    expect(async () => await updateUserPassword(param)).rejects.toThrow(
      /^missing hashedPassword$/,
    )
  })

  test('getPasswordRecoveryToken function should update user password and return token data', async () => {
    const param: any = {
      token: uuid,
    }
    prismaMock.passwordRecoveryToken.findUnique.mockResolvedValue(
      passwordRecoveryToken,
    )
    const result = await getPasswordRecoveryToken(param)
    expect(result).toEqual(passwordRecoveryToken)
  })

  test('Missing token parameter should raise an missing token error', async () => {
    const param: any = {
      // token: uuid,
    }
    expect(async () => await getPasswordRecoveryToken(param)).rejects.toThrow(
      /^missing token$/,
    )
  })

  test('deleteUser function should delete and return an user', async () => {
    const param: any = {
      userId: uuid,
    }
    prismaMock.user.delete.mockResolvedValue(user)
    const result = await deleteUser(param)
    expect(result).toEqual(user)
  })

  test('Missing userId parameter should raise an missing userId error', async () => {
    const param: any = {
      // userId: uuid,
    }
    expect(async () => await deleteUser(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('deleteUserKey function should delete and return an user', async () => {
    const param: any = {
      userId: uuid,
    }
    prismaMock.userKey.delete.mockResolvedValue(userKey)
    const result = await deleteUserKey(param)
    expect(result).toEqual(userKey)
  })

  test('Missing userId parameter should raise an missing userId error', async () => {
    const param: any = {
      // userId: uuid,
    }
    expect(async () => await deleteUserKey(param)).rejects.toThrow(
      /^missing userId$/,
    )
  })

  test('createUser fn should return new candidate', async () => {
    const param: any = {
      email: email_1,
      name: text,
      hashedPassword: text,
    }
    prismaMock.user.create.mockResolvedValue(user)
    expect(await createUser(param)).toEqual(user)
  })

  test('Missing email param should return a missing email error', async () => {
    const param: any = {
      // email: email_1,
      name: text,
      hashedPassword: text,
    }
    expect(async () => await createUser(param)).rejects.toThrow(
      /^missing email$/,
    )
  })

  test('Missing name param should return a missing name error', async () => {
    const param: any = {
      email: email_1,
      // name: text,
      hashedPassword: text,
    }
    expect(async () => await createUser(param)).rejects.toThrow(
      /^missing name$/,
    )
  })

  test('Missing hashedPassword param should return a missing hashedPassword error', async () => {
    const param: any = {
      email: email_1,
      name: text,
      // hashedPassword: text,
    }
    expect(async () => await createUser(param)).rejects.toThrow(
      /^missing hashedPassword$/,
    )
  })
})
