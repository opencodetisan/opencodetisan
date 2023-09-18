import {withAuth} from 'next-auth/middleware'
import {NextResponse} from 'next/server'
import {UserRole} from './enums'

interface IUserProps {
  name: string
  email: string
  role: UserRole
}

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname
    const user = req.nextauth.token?.user as IUserProps
    const role = user.role

    if (pathname.startsWith('/a') && role !== UserRole.Admin) {
      return NextResponse.rewrite(new URL('/', req.url))
    } else if (pathname.startsWith('/u') && role === UserRole.Candidate) {
      return NextResponse.rewrite(new URL('/', req.url))
    }

    const response = NextResponse.next()
    return response
  },
  {
    callbacks: {
      authorized: ({token}) => {
        return !!token
      },
    },
  },
)

export const config = {matcher: ['/a/:path*', '/u/:path*', '/c/:path*']}
