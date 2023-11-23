import {NextResponse} from 'next/server'
import {UserRole} from './enums'
import {getRoleURLSegment} from './lib/utils'
import { getToken } from 'next-auth/jwt';

interface IUserProps {
  name: string
  email: string
  role: UserRole
}

//Todo: Fix type
export async function middleware(req: any) {
    const token = await getToken({req, secret:process.env.NEXTAUTH_SECRET})
    const user = token?.user as IUserProps
    const role = user?.role
    const roleURLSegment = getRoleURLSegment(role)
    const defaultRedirect = new URL(roleURLSegment, process.env.NEXTAUTH_URL)

    const url = req.nextUrl.clone();

    if (!user && url.pathname === '/') {
        return NextResponse.next();
    }

    if (!user && !url.pathname.startsWith('/signin')) {
        const callbackUrl = req.nextUrl.href
        url.pathname = '/signin';
        url.searchParams.set('callbackUrl', callbackUrl);
        return NextResponse.redirect(url);
    }

    if (user && (url.pathname === '/' || url.pathname === '/signin')) {
        return NextResponse.redirect(defaultRedirect)
    }
}

export const config = {
  matcher: ['/','/signin','/a/:path*', '/r/:path*', '/c/:path*'],
}
