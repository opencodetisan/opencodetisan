import {CandidatePointLevel, QuizDifficulty, UserRole} from '@/enums'
import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToMinuteSecond = (seconds: number) => {
  if (seconds === undefined) {
    throw Error('missing seconds')
  }
  const minutes = Math.floor(seconds / 60)
  const newSeconds = Math.round(seconds - minutes * 60)
  return {minutes, seconds: newSeconds}
}

export const getCandidatePointLevel = (value: number) => {
  if (value < 49) {
    return CandidatePointLevel.Low
  } else if (value < 79) {
    return CandidatePointLevel.Medium
  } else {
    return CandidatePointLevel.High
  }
}

export const getQuizTimeLimit = (difficultyLevel: string) => {
  switch (difficultyLevel) {
    case QuizDifficulty.Easy:
      return 5
    case QuizDifficulty.Medium:
      return 15
    case QuizDifficulty.Hard:
      return 30
    default:
      return 5
  }
}

export const getRoleURLSegment = (role: UserRole) => {
  switch (role) {
    case UserRole.User:
      return '/u'
    case UserRole.Admin:
      return '/a'
    case UserRole.Candidate:
      return 'c'
  }
}
