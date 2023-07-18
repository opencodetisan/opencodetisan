import { ICreateQuizProps } from "@/types/index";
import prisma from "@/lib/db/client";

export const createQuiz = async (quizData: ICreateQuizProps) => {
  if (!quizData.title) {
    throw new Error("missing quiz title");
  } else if (!quizData.codeLanguageId) {
    throw new Error("missing code language id");
  } else if (!quizData.userId) {
    throw new Error("missing user id");
  } else if (!quizData.difficultyLevelId) {
    throw new Error("missing difficulty level id");
  } else if (!quizData.instruction) {
    throw new Error("missing instruction");
  } else if (!quizData.answer) {
    throw new Error("missing answer");
  } else if (!quizData.defaultCode) {
    throw new Error("missing default code");
  } else if (!quizData.locale) {
    throw new Error("missing locale");
  }
  const quiz = await prisma.quiz.create({ data: quizData });
  return quiz;
};
