import prisma from '@/lib/db/client'
import {NextResponse} from 'next/server'

export async function GET() {
  const quizzes = await prisma.quiz.findMany()

  return NextResponse.json(quizzes)
}
