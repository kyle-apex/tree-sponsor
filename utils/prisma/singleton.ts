import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';

import prisma from './init-test';

jest.mock('./init-test', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  console.log('primsaMock', prismaMock);
  console.log('prismaNon', prisma);
  mockReset(prismaMock);
});

export const prismaMock = (prisma as unknown) as DeepMockProxy<PrismaClient>;
