import {
  ICreateQuizProps,
  ICreateQuizSolutionProps,
  ICreateQuizTestCaseProps,
  IUpdateQuizDataProps,
  IUpdateQuizSolutionProps,
  UpdateQuizWhereConditionType,
} from "@/types/index";
import prisma from "@/lib/db/client";
import { TestCase } from "@prisma/client";

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
  } else if (!solutionData.sequence) {
    throw new Error("missing sequence");
  } else if (!solutionData.importDirectives) {
    throw new Error("missing import directives");
  } else if (!solutionData.testRunner) {
    throw new Error("missing test runner");
  }
  const solution = await prisma.solution.create({
    data: solutionData,
  });
  return solution;
};

export const createQuizTestCases = async (
  testCaseData: ICreateQuizTestCaseProps[],
) => {
  if (!testCaseData || testCaseData.length === 0) {
    throw new Error("test case not found");
  }
  const hasAllProps = testCaseData.every((testCase) => {
    return ["solutionId", "input", "output", "sequence"].every((prop) =>
      testCase.hasOwnProperty(prop),
    );
  });
  if (!hasAllProps) {
    throw new Error("test case missing attributes");
  }
  const testCases = await prisma.testCase.createMany({ data: testCaseData });
  return testCases;
};

export const updateQuizData = async ({
  id,
  userId,
  instruction,
  title,
  codeLanguageId,
  difficultyLevelId,
}: IUpdateQuizDataProps) => {
  if (!id) {
    throw new Error("missing quiz id");
  } else if (!userId) {
    throw new Error("missing user id");
  }
  const updatedQuiz = await prisma.quiz.updateMany({
    where: { id, userId },
    data: {
      instruction,
      title,
      codeLanguageId,
      difficultyLevelId,
    },
  });
  return updatedQuiz;
};

export const updateQuizSolution = async ({
  solutionId,
  quizId,
  code,
  importDirectives,
  testRunner,
  defaultCode,
}: IUpdateQuizSolutionProps) => {
  if (!quizId) {
    throw new Error("missing quiz id");
  } else if (!code) {
    throw new Error("missing code");
  }
  const updatedSolution = await prisma.solution.upsert({
    where: {
      id: solutionId ?? "",
    },
    create: {
      quizId,
      code,
      //entryFunction,
      //appendCode,
      importDirectives,
      testRunner,
    },
    update: {
      code,
      //entryFunction,
      //appendCode,
      importDirectives,
      testRunner,
      quiz: {
        update: {
          defaultCode,
        },
      },
    },
  });
  return updatedSolution;
};

export const updateQuizTestCases = async ({
  existingTests,
  tests,
}: {
  existingTests: TestCase[];
  tests: any;
}) => {
  if (!existingTests || existingTests.length === 0) {
    throw new Error("missing existing test cases");
  } else if (!tests) {
    throw new Error("missing new test cases");
  }
  let i = -1;
  const txn = await prisma.$transaction(
    existingTests.map((test) => {
      i++;
      return prisma.testCase.update({
        where: {
          id: test.id,
        },
        data: {
          input: tests.input[i],
          output: tests.output[i],
        },
      });
    }),
  );
  return txn;
};
