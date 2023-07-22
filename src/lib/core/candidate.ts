import { ICreateCandidateQuizSubmissionProps } from "@/types";
import prisma from "../db/client";

export const createCandidateQuizSubmission = async ({
  userId,
  quizId,
  code,
}: ICreateCandidateQuizSubmissionProps) => {
  if (!userId) {
    throw new Error("missing userId");
  } else if (!quizId) {
    throw new Error("missing quizId");
  } else if (!code) {
    throw new Error("missing code");
  }
  const submission = await prisma.submission.create({
    data: {
      userId,
      quizId,
      code,
    },
  });
  return submission;
};
