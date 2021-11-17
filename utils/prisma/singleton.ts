import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';

import prisma1 from './init-test';

jest.mock('./init-test', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = (prisma1 as unknown) as DeepMockProxy<PrismaClient>;
export const prisma = prismaMock;
