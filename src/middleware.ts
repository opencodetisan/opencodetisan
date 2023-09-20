import {withAuth} from 'next-auth/middleware'
import {NextResponse} from 'next/server'
import {UserRole} from './enums'
import {getRoleURLSegment} from './lib/utils'

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
    const roleURLSegment = getRoleURLSegment(role)

    if (pathname.startsWith('/a') && role !== UserRole.Admin) {
      return NextResponse.redirect(
        new URL(roleURLSegment, process.env.NEXTAUTH_URL),
      )
    } else if (pathname.startsWith('/u') && role === UserRole.Candidate) {
      return NextResponse.redirect(
        new URL(roleURLSegment, process.env.NEXTAUTH_URL),
      )
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
