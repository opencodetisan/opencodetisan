import {randomBytes, randomUUID} from 'crypto'
import {NextApiRequest, NextApiResponse} from 'next'
import NextAuth, {AuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import {getUserForAuth} from '@/lib/core/user'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {label: 'Username', type: 'text', placeholder: 'jsmith'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials) {
        if (!credentials?.password || !credentials?.username) {
          return null
        }
        try {
          const user = await getUserForAuth({email: credentials.username})

          if (user && user.userKey?.hashedPassword) {
            const hashedPassword = user.userKey?.hashedPassword
            const isMatch = await bcrypt.compare(
              credentials.password,
              hashedPassword,
            )

            if (isMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              }
            }
          }
        } catch (error) {
          console.log(error)
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex')
    },
  },
  pages: {
    signIn: '/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
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
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
