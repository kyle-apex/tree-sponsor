/* eslint-disable @typescript-eslint/ban-ts-comment */
import { updateUser } from '../../../utils/prisma/update-user';
import { prismaMock } from '../../../utils/prisma/singleton';

test('should create new user ', async () => {
  const user = {
    id: 1,
    name: 'Rich',
    email: 'hello@prisma.io',
    displayName: 'Rich',
    emailVerified: new Date(),
    image: '',
    hasShirt: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    stripeCustomerId: '4',
  };

  //@ts-ignore
  prismaMock.user.create.mockResolvedValue(user);
  //@ts-ignore
  prismaMock.user.update.mockResolvedValue(user);

  await prismaMock.user.create({ data: user });

  const newUser = await updateUser(1, { name: 'Rich2' });

  expect(newUser.name).toEqual('Rich2');
});
