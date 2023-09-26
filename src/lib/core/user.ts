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
