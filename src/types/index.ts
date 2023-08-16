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

export interface ICreateAssessmentProps {
  userId: string
  title: string
  description: string
  quizIds: string[]
}

export interface ICreateAssessmentServiceProps extends ICreateAssessmentProps {}

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

export interface IAssessmentQuizProps {
  quiz: {
    difficultyLevel: {
      name: string
    }
    id: string
    title: string
    instruction: string
    difficultyLevelId: number
  }
}

export interface IGetAssessmentComparativeScoreProps {
  usersBelowPointCount: number
  usersCount: number
  point: number
  quizPoint?: number
}

export interface IAssessmentPointsProps {
  [key: string]: {point: number; id: string}
}

export interface IGetAssessmentQuizPointProps {
  assessmentQuizzes: IAssessmentQuizProps[]
  assessmentPoints: IAssessmentPointsProps
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

export interface IGetActivityLogsProps {
  assessmentIds: string[]
  amount?: number
  skip?: number
}

export interface IUpdateAssessmentAcceptanceProps {
  assessmentId: string
  candidateId: string
  assessmentResults: {candidateId: string; quizId: string}[]
  token: string
}

export interface ICreateQuizServiceProps {
  quizData: ICreateQuizProps
  quizSolution: Pick<
    ICreateQuizSolutionProps,
    'code' | 'sequence' | 'testRunner' | 'importDirectives'
  >
  quizTestCases: ICreateQuizTestCaseProps[]
}
