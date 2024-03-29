import {
  CandidatePointLevel,
  DifficultyLevel,
  QuizDifficulty,
  UserRole,
} from '@/enums'
import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'
import {SiJavascript, SiPython, SiCsharp, SiCplusplus, SiC} from 'react-icons/si'

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
    case UserRole.Recruiter:
      return '/r/assessments'
    case UserRole.Admin:
      return '/a/assessments'
    case UserRole.Candidate:
      return '/c/assessments'
  }
}

export const getDifficultyLevel = (levelId: number = 1) => {
  switch (levelId) {
    case DifficultyLevel.Easy:
      return {
        name: 'Easy',
        color: 'bg-green-600',
      }
    case DifficultyLevel.Medium:
      return {
        name: 'Medium',
        color: 'bg-yellow-600',
      }
    case DifficultyLevel.Hard:
      return {
        name: 'Hard',
        color: 'bg-red-600',
      }
    default:
      return {
        name: 'Easy',
        color: 'green',
      }
  }
}

export const getCodeLanguage = (codeLanguageId: number = 1) => {
  switch (codeLanguageId) {
    case 1:
      return {
        pretty: 'JavaScript',
        mode: 'javascript',
        lang: 'javascript',
        indentUnit: 2,
        icon: SiJavascript,
      }
    case 2:
      return {
        pretty: 'Python',
        mode: 'python',
        lang: 'python',
        indentUnit: 4,
        icon: SiPython,
      }
    case 3:
      return {
        pretty: 'C#',
        mode: 'text/x-csharp',
        lang: 'csharp',
        indentUnit: 4,
        icon: SiCsharp,
      }
    case 5:
      return {
        pretty: 'C',
        mode: 'text/x-csrc',
        lang: 'c',
        indentUnit: 4,
        icon: SiC,
      }
    case 6:
      return {
        pretty: 'C++',
        mode: 'text/x-c++src',
        lang: 'cpp',
        indentUnit: 2,
        icon: SiCplusplus,
      }
    case 7:
      return {
        pretty: 'Java',
        mode: 'text/x-java',
        lang: 'java',
        indentUnit: 4,
        icon: SiJavascript,
      }
    default:
      return {
        pretty: 'JavaScript',
        mode: 'javascript',
        lang: 'javascript',
        indentUnit: 2,
        icon: SiJavascript,
      }
  }
}
