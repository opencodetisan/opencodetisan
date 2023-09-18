import prisma from '@/lib/db/client'
import {randomBytes, randomUUID} from 'crypto'
import {NextApiRequest, NextApiResponse} from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: {label: 'Username', type: 'text', placeholder: 'jsmith'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        // const user = await res.json()

        const user = await prisma.user.findUnique({
          // where: {email: credentials?.username},
          where: {email: 'email@email.com'},
          select: {email: true, role: true, name: true},
        })
        if (user) {
          return user
        }
        return null
      },
    }),
  ]

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      generateSessionToken: () => {
        return randomUUID?.() ?? randomBytes(32).toString('hex')
      },
    },
    // pages: {
    //   signIn: '/auth/signin',
    //   signOut: '/auth/signout',
    //   error: '/auth/error', // Error code passed in query string as ?error=
    //   verifyRequest: '/auth/verify-request', // (used for check email message)
    //   newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    // },
    callbacks: {
      async jwt({token, user, account, profile}) {
        const isSignIn = user ? true : false
        if (isSignIn) {
          token.user = user
        }
        return Promise.resolve(token)
      },
      async session({session, token}) {
        if (!session?.user || !token?.account) {
          return session
        }
        return session
      },
    },
  })
}

export {auth as GET, auth as POST}
