import {PrismaClient} from '@prisma/client'
import {mockDeep, mockReset, DeepMockProxy} from 'jest-mock-extended'

import prisma from './client'

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

if (process.env.npm_lifecycle_event === 'test:integration') {
  jest.unmock('./client')
}

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
