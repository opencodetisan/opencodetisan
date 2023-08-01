export interface ITestCaseProps {
  id: string
  input: string
  output: string
  sequence: number
  createdAt: Date
  updatedAt: Date
  solutionId: string
}

export interface ITestCaseClientProps {
  input: string[]
  output: string[]
}

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
  solutionId: string
  code: string
  importDirectives?: string
  testRunner?: string
  defaultCode?: string
}

export interface ICreateCandidateQuizSubmissionProps {
  userId: string
  quizId: string
  code: string
}

export interface IcreateAssessmentProps {
  userId: string
  title: string
  description: string
  quizIds: string[]
}

export interface ICandidateEmailStatusProps {
  assessmentId: string
  email: string
  statusCode: number
  errorMessage: string
}

export interface IUpdateAssessmentProps {
  assessmentId: string
  title: string
  description: string
}

export interface IUpdateAssessmentCandidateStatusProps {
  assessmentId: string
  candidateId: string
}

export interface IAddAssessmentQuizzesProps {
  quizIds: string[]
  assessmentId: string
}

export interface IAddAssessmentQuizzesProps {
  quizId: string
  assessmentId: string
}

export interface IDeleteAssessmentQuizSubmissionsProps {
  submissionIds: string[]
}

export interface IUpdateQuizTestCasesProps {
  existingTests: ITestCaseProps[]
  newTests: ITestCaseClientProps
}

export interface ICreateCandidateQuizSubmissionProps {
  userId: string
  quizId: string
  code: string
}

export interface IAssessmentEmailProps {
  locale: string
  recipient: string
  assessmentUrl: string
  companyName: string
}
