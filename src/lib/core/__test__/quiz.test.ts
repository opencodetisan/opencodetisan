import {
  createQuiz,
  createQuizSolution,
  createQuizTestCases,
  deleteQuiz,
  deleteQuizSolution,
  deleteQuizTestCases,
  updateQuizData,
  updateQuizSolution,
  updateQuizTestCases,
} from "@/lib/core/quiz";
import { faker } from "@faker-js/faker";
import { prismaMock } from "@/lib/db/prisma-mock-singleton";

describe("Quiz module", () => {
  test("createQuiz function should save the quiz data and return the saved data", async () => {
    const quizData: any = {
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
    const quizData: any = {
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
  test("Missing codeLanguageId parameter should raise an missing code language error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      // codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing code language id",
    );
  });

  test("Missing userId parameter should raise an missing user id error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      // userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing user id",
    );
  });

  test("Missing difficultyLevelId parameter should raise a missing difficulty level id error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      // difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing difficulty level id",
    );
  });

  test("Missing instruction parameter should raise a missing instruction error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      // instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing instruction",
    );
  });

  test("Missing answer parameter should raise a missing answer error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      // answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing answer",
    );
  });

  test("Missing default code parameter should raise a missing default code error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      // defaultCode: faker.lorem.paragraphs(),
      locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing default code",
    );
  });

  test("Missing locale parameter should raise a missing locale error", async () => {
    const quizData: any = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.text(),
      codeLanguageId: 1,
      difficultyLevelId: 1,
      instruction: faker.lorem.paragraphs(),
      answer: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraphs(),
      // locale: "en",
    };
    prismaMock.quiz.create.mockResolvedValue(quizData);
    expect(async () => await createQuiz(quizData)).rejects.toThrow(
      "missing locale",
    );
  });

  test("createQuizSolution fn should save and return quiz solution", async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    const savedQuizSolution = await createQuizSolution(solutionData);
    expect(savedQuizSolution).toEqual(solutionData);
  });

  test("Missing quizId parameter should raise a missing quiz id error", async () => {
    const solutionData: any = {
      // quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      "missing quiz id",
    );
  });

  test("Missing code parameter should raise a missing code error", async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      // code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      "missing code",
    );
  });

  test("Missing sequence parameter should raise a missing sequence error", async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      // sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      "missing sequence",
    );
  });

  test("Missing importDirectives parameter should raise a missing import directives error", async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      // importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      "missing import directives",
    );
  });

  test("Missing testRunner parameter should raise a missing test runner error", async () => {
    const solutionData: any = {
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      sequence: 1,
      importDirectives: faker.lorem.paragraphs(),
      // testRunner: faker.lorem.paragraphs(),
    };
    prismaMock.solution.create.mockResolvedValue(solutionData);
    expect(async () => await createQuizSolution(solutionData)).rejects.toThrow(
      "missing test runner",
    );
  });

  test("createQuizTestCases fn should save and return test cases", async () => {
    const testCaseData: any = [
      {
        solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
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

  test("Missing test case attributes should raise a test case missing attributes error", async () => {
    const testCaseData: any = [
      {
        // solutionId: faker.string.uuid(),
        input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
      {
        solutionId: faker.string.uuid(),
        // input: faker.lorem.text(),
        output: faker.lorem.text(),
        sequence: 1,
      },
    ];
    prismaMock.testCase.createMany.mockResolvedValue(testCaseData);
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      "test case missing attributes",
    );
  });

  test("Undefined testCaseData should raise a test case not found error", async () => {
    const testCaseData: any = undefined;
    prismaMock.testCase.createMany.mockResolvedValue(testCaseData);
    expect(async () => await createQuizTestCases(testCaseData)).rejects.toThrow(
      "test case not found",
    );
  });

  test("updateQuizData fn should update and return updated quiz data", async () => {
    const quizData: any = {
      userId: faker.string.uuid(),
      id: faker.string.uuid(),
    };
    prismaMock.quiz.updateMany.mockResolvedValue(quizData);
    expect(await updateQuizData(quizData)).toEqual(quizData);
  });

  test("Missing quiz id parameter should raise a missing quiz id error", async () => {
    const quizData: any = {
      userId: faker.string.uuid(),
      // id: faker.string.uuid(),
    };
    prismaMock.quiz.updateMany.mockResolvedValue(quizData);
    expect(async () => await updateQuizData(quizData)).rejects.toThrow(
      "missing quiz id",
    );
  });

  test("Missing user id parameter should raise a missing user id error", async () => {
    const quizData: any = {
      // userId: faker.string.uuid(),
      id: faker.string.uuid(),
    };
    prismaMock.quiz.updateMany.mockResolvedValue(quizData);
    expect(async () => await updateQuizData(quizData)).rejects.toThrow(
      "missing user id",
    );
  });

  test("updateQuizSolution fn should update and return updated quiz solution", async () => {
    const solutionData: any = {
      solutionId: faker.string.uuid(),
      quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
      // defaultCode: faker.lorem.paragraph()
    };
    prismaMock.solution.upsert.mockResolvedValue(solutionData);
    expect(await updateQuizSolution(solutionData)).toEqual(solutionData);
  });

  test("Missing quizId parameter should raise a missing quiz id error", async () => {
    const solutionData: any = {
      solutionId: faker.string.uuid(),
      // quizId: faker.string.uuid(),
      code: faker.lorem.paragraphs(),
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraph(),
    };
    prismaMock.solution.upsert.mockResolvedValue(solutionData);
    expect(async () => await updateQuizSolution(solutionData)).rejects.toThrow(
      "missing quiz id",
    );
  });

  test("Missing code parameter should raise a missing code id error", async () => {
    const solutionData: any = {
      solutionId: faker.string.uuid(),
      quizId: faker.string.uuid(),
      // code: faker.lorem.paragraphs(),
      importDirectives: faker.lorem.paragraphs(),
      testRunner: faker.lorem.paragraphs(),
      defaultCode: faker.lorem.paragraph(),
    };
    prismaMock.solution.upsert.mockResolvedValue(solutionData);
    expect(async () => await updateQuizSolution(solutionData)).rejects.toThrow(
      "missing code",
    );
  });

  test("updateQuizTestCases fn should update and return updated quiz test cases", async () => {
    const testCaseData: any = {
      existingTests: [faker.lorem.text(), faker.lorem.text()],
      tests: { input: [faker.lorem.text], output: [faker.lorem.text()] },
    };
    prismaMock.testCase.update.mockResolvedValue(testCaseData);
    prismaMock.$transaction.mockResolvedValue(testCaseData);
    expect(await updateQuizTestCases(testCaseData)).toEqual(testCaseData);
  });

  test("deleteQuizTestCases fn should delete test cases and return count number", async () => {
    prismaMock.testCase.deleteMany.mockResolvedValue({ count: 4 });
    expect(
      await deleteQuizTestCases({ solutionId: faker.string.uuid() }),
    ).toEqual({ count: 4 });
  });

  test("Missing solutionId parameter should raise a missing solutionId error", async () => {
    const solutionId: any = undefined;
    prismaMock.testCase.deleteMany.mockResolvedValue({ count: 4 });
    expect(
      async () => await deleteQuizTestCases({ solutionId }),
    ).rejects.toThrow("missing solutionId");
  });

  test("deleteQuizSolution fn should delete solutions and return count number", async () => {
    prismaMock.solution.deleteMany.mockResolvedValue({ count: 4 });
    expect(await deleteQuizSolution({ quizId: faker.string.uuid() })).toEqual({
      count: 4,
    });
  });

  test("Missing quizId parameter should raise a missing quizId error", async () => {
    const quizId: any = undefined;
    prismaMock.solution.deleteMany.mockResolvedValue({ count: 4 });
    expect(async () => await deleteQuizSolution({ quizId })).rejects.toThrow(
      "missing quizId",
    );
  });

  test("deleteQuiz fn should delete quiz and return deleted quiz", async () => {
    const deletedQuiz: any = { title: faker.lorem.text() };
    prismaMock.quiz.delete.mockResolvedValue(deletedQuiz);
    expect(await deleteQuiz({ quizId: faker.string.uuid() })).toEqual(
      deletedQuiz,
    );
  });

  test("Missing quizId parameter should raise a missing quizId error", async () => {
    const quizId: any = undefined;
    expect(async () => await deleteQuiz({ quizId })).rejects.toThrow(
      "missing quizId",
    );
  });
});
