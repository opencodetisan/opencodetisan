import prisma from '../db/client'

export const getUserForAuth = async ({email}: {email: string}) => {
  if (!email) {
    throw Error('missing email')
  }
  const user = await prisma.user.findUnique({
    where: {email},
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      userKey: {
        select: {
          hashedPassword: true,
        },
      },
    },
  })
  return user
}

export const getUserByEmail = async ({email}: {email: string}) => {
  if (!email) {
    throw Error('missing email')
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  return user
}

export const createUserToken = async ({
  email,
  token,
  expiredAt,
}: {
  email: string
  token: string
  expiredAt: Date
}) => {
  if (!email) {
    throw Error('missing email')
  } else if (!token) {
    throw Error('missing token')
  } else if (!expiredAt) {
    throw Error('missing expiredAt')
  }

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordRecoveryToken: {
        create: {
          token,
          expiredAt,
        },
      },
    },
  })

  return user
}

export const updateUserPassword = async ({
  token,
  encryptedPassword,
}: {
  token: string
  encryptedPassword: string
}) => {
  if (!token) {
    throw Error('missing token')
  } else if (!encryptedPassword) {
    throw Error('missing encryptedPassword')
  }

  const result = await prisma.passwordRecoveryToken.update({
    where: {
      token,
      isRecovered: false,
    },
    data: {
      isRecovered: true,
      user: {
        update: {
          userKey: {
            update: {
              password: encryptedPassword,
            },
          },
        },
      },
    },
  })

  return result
}

export const getPasswordRecoveryToken = async ({token}: {token: string}) => {
  if (!token) {
    throw Error('missing token')
  }
  const result = await prisma.passwordRecoveryToken.findUnique({
    where: {token},
  })
  return result
}
