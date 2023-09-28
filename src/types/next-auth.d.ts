import {UserRole} from '@/enums'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string
      email?: string
      role?: UserRole.Admin | UserRole.Candidate | UserRole.Recruiter
    }
  }
}
