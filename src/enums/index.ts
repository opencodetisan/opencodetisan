export enum AssessmentPoint {
  SpeedPoint = 'speedPoint',
  EasyQuizCompletionPoint = 'easyQuizCompletionPoint',
  MediumQuizCompletionPoint = 'mediumQuizCompletionPoint',
  HardQuizCompletionPoint = 'hardQuizCompletionPoint',
}

export enum AssessmentComparativeScoreLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum CandidateActionId {
  Accept = 1,
  Complete,
  Decline,
}

export enum AssessmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum AssessmentQuizStatus {
  Pending = 'PENDING',
  Started = 'STARTED',
  Completed = 'COMPLETED',
}

export enum CandidatePointLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum QuizDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum UserRole {
  Candidate = 'CANDIDATE',
  Admin = 'ADMIN',
  Recruiter = 'RECRUITER',
}

export enum DifficultyLevel {
  Easy = 1,
  Medium,
  Hard,
}
