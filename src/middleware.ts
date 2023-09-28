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

    if (pathname.startsWith('/auth-redirect')) {
      return NextResponse.redirect(
        new URL(roleURLSegment, process.env.NEXTAUTH_URL),
      )
    } else {
      if (role === UserRole.Recruiter && !pathname.startsWith('/r')) {
        return NextResponse.redirect(
          new URL(roleURLSegment, process.env.NEXTAUTH_URL),
        )
      } else if (role === UserRole.Candidate && !pathname.startsWith('/c')) {
        return NextResponse.redirect(
          new URL(roleURLSegment, process.env.NEXTAUTH_URL),
        )
      }
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

export const config = {
  matcher: ['/auth-redirect', '/a/:path*', '/r/:path*', '/c/:path*'],
}
