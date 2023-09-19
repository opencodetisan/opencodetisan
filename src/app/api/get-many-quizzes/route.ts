import prisma from '@/lib/db/client'
import {NextResponse} from 'next/server'

export async function GET() {
  // const res = await fetch('https://data.mongodb-api.com/...', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY,
  //   },
  // })
  // const data = await res.json()
  const quizzes = await prisma.quiz.findMany()

  return NextResponse.json(quizzes)
}
