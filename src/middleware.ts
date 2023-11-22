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
    const defaultRedirect = new URL(roleURLSegment, domain)
    const url = req.nextUrl.href

    if (pathname.startsWith('/auth-redirect')) {
      return NextResponse.redirect(callbackUrl ?? defaultUrl)
    } else if (pathname.startsWith('/a') && role === UserRole.Admin) {
      return NextResponse.next()
    } else if (pathname.startsWith('/r') && role === UserRole.Recruiter) {
      return NextResponse.next()
    } else if (pathname.startsWith('/c') && role === UserRole.Candidate) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(defaultRedirect)
    }
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
