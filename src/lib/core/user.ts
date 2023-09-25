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
