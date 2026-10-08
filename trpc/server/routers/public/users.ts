import { User } from '@/schemas/user';
import { t } from '../../index';
import { pagingSchema } from '@/schemas/common';

export const usersRouter = t.router({
  list: t.procedure.input(pagingSchema).query(async ({ input }) => {
    const users: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatarUrl: 'https://example.com/avatar2.jpg',
      },
    ];

    const { page, limit } = input;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    const result = await Promise.all(paginatedUsers.map(async (user) => ({ ...user })));

    return result;
  }),
});
