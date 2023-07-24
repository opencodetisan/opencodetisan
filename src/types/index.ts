export interface ICreateQuizProps {
  id: string
  title: string
  codeLanguageId: number
  difficultyLevelId: number
  userId: string
  instruction: string
  answer: string
  defaultCode: string
  locale: string
}

export interface ICreateQuizSolutionProps {
  quizId: string
  code: string
  //entryFunction: mainFunction,
  //appendCode,
  sequence: number
  importDirectives: string
  testRunner: string
}

export interface ICreateQuizTestCaseProps {
  solutionId: string
  input: string
  output: string
  sequence: number
}

export interface IUpdateQuizProps {
  id: string
  userId: string
  instruction?: string
  title?: string
  codeLanguageId?: number
  difficultyLevelId?: number
  postUrl?: string
}

export interface IUpdateQuizSolutionProps {
  solutionId?: string
  code: string
  importDirectives?: string
  testRunner?: string
  defaultCode?: string
}
