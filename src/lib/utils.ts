import {CandidatePointLevel} from '@/enums'

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
