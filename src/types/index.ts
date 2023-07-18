export interface ICreateQuizProps {
  id?: string;
  title: string;
  codeLanguageId: number;
  difficultyLevelId: number;
  userId: string;
  instruction: string;
  answer: string;
  defaultCode: string;
  locale: string;
}

export interface ICreateQuizSolutionProps {
  quizId: string;
  code: string;
  //entryFunction: mainFunction,
  //appendCode,
  sequence: number;
  importDirectives: string;
  testRunner: string;
}

export interface ICreateQuizTestCaseProps {
  solutionId: string;
  input: string;
  output: string;
  sequence: number;
}

export interface ICreateQuizOGImageProps {
  title: string;
  codeLanguageId: number;
  locale: string;
  quizId: string;
  difficultyLevelTrans: string;
  ogImageTextTranslation: string;
}
