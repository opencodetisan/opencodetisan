import {UserRole} from '@/enums'
import prisma from '../db/client'

export const getManyUserByEmail = async ({emails}: {emails: string[]}) => {
  if (!emails) {
    throw Error('missing emails')
  } else if (!emails[0]) {
    throw Error('empty emails')
  }
  const candidates = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
    select: {
      email: true,
      id: true,
    },
  })
  return candidates
}

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
          password: true,
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

export const createUser = async ({
  email,
  name,
  hashedPassword,
  remarks,
}: {
  email: string
  name: string
  hashedPassword: string
  remarks: string
}) => {
  if (!email) {
    throw Error('missing email')
  } else if (!name) {
    throw Error('missing name')
  } else if (!hashedPassword) {
    throw Error('missing hashedPassword')
  } else if (!remarks) {
    throw Error('missing remarks')
  }
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      remarks,
      userKey: {
        create: {
          password: hashedPassword,
        },
      },
    },
  })
  return newUser
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
  hashedPassword,
}: {
  token: string
  hashedPassword: string
}) => {
  if (!token) {
    throw Error('missing token')
  } else if (!hashedPassword) {
    throw Error('missing hashedPassword')
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
              password: hashedPassword,
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

export const deleteUserKey = async ({userId}: {userId: string}) => {
  if (!userId) {
    throw Error('missing userId')
  }
  const user = await prisma.userKey.delete({
    where: {
      id: userId,
    },
  })
  return user
}

export const deleteUser = async ({userId}: {userId: string}) => {
  if (!userId) {
    throw Error('missing userId')
  }
  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  })
  return user
}
