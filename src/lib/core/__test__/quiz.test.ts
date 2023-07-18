import {
  createQuiz,
  createQuizSolution,
  createQuizTestCases,
} from "@/lib/core/quiz";
import { faker } from "@faker-js/faker";
import { prismaMock } from "@/lib/db/prisma-mock-singleton";

describe("Quiz module", () => {
  test("createQuiz function should save the quiz data and return the saved data", async () => {
    const quizData = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    const savedQuiz = await createQuiz(quizData);
    expect(savedQuiz).toBe(quizData);
  });

  test("Missing title parameter should raise an missing title error", async () => {
    const quizData = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      //title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing quiz title",
    );
  });

  //Continue to test remaining missing mandatory input parameter for createQuiz function
  test("createQuizSolution fn should save and return quiz solution", async () => {
    const solutionData = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 0,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    const savedQuizSolution = await createQuizSolution(solutionData);
    expect(savedQuizSolution).toEqual(solutionData);
  });

  test("createQuizTestCases fn should save and return test cases", async () => {
    const testCaseData = [
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 0,
      },
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
    ];
    prismaMock.testCase.createMany.mockResolvedValue(testCaseData);
    const saveQuizTestCases = await createQuizTestCases(testCaseData);
    expect(saveQuizTestCases).toEqual(testCaseData);
  });
});
