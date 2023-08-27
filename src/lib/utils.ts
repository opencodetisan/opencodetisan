import {CandidatePointLevel, QuizDifficulty} from '@/enums'

export const convertToMinuteSecond = (seconds: number) => {
  if (!seconds) {
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
