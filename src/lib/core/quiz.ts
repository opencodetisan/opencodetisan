import {
  ICreateQuizOGImageProps,
  ICreateQuizProps,
  ICreateQuizSolutionProps,
  ICreateQuizTestCaseProps,
} from "@/types/index";
import prisma from "@/lib/db/client";
import fetch from "node-fetch";

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

export const createQuizSolution = async (
  solutionData: ICreateQuizSolutionProps,
) => {
  if (!solutionData.quizId) {
    throw new Error("missing quiz id");
  } else if (!solutionData.code) {
    throw new Error("missing code");
  }
  const solution = await prisma.solution.create({
    data: solutionData,
  });
  return solution;
};

export const createQuizTestCases = async (
  testCaseData: ICreateQuizTestCaseProps[],
) => {
  if (testCaseData.length === 0) {
    throw new Error("test case not found");
  }
  const testCases = await prisma.testCase.createMany({ data: testCaseData });
  return testCases;
};

export const createQuizOGImage = async (data: ICreateQuizOGImageProps) => {
  const result = await fetch(`${process.env.NEXTAUTH_URL}/api/og-generator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return result;
};
