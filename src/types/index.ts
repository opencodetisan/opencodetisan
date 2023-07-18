export interface ICreateQuizProps {
  id: string?
  title: string
  codeLanguageId: number
  difficultyLevelId: number
  userId: string
  instruction: string
  answer: string
  defaultCode: string
  locale: string
}

export interface ICreateSolutionProps {
  quizId: string;
  code: string;
  //entryFunction: mainFunction,
  //appendCode,
  sequence: number;
  importDirectives: string;
  testRunner: string;
}
