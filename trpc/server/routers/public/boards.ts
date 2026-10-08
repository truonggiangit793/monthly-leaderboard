import { pagingSchema } from '@/schemas/common';
import { t } from '../../index';
import { z } from 'zod';
import { Board } from '@/schemas/board';
import { User } from '@/schemas/user';

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'An Nguyen',
    email: 'an.nguyen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Binh Tran',
    email: 'binh.tran@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Chi Le',
    email: 'chi.le@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'Duc Pham',
    email: 'duc.pham@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'Ha Nguyen',
    email: 'ha.nguyen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    name: 'Khanh Vo',
    email: 'khanh.vo@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: 7,
    name: 'Linh Tran',
    email: 'linh.tran@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: 8,
    name: 'Minh Hoang',
    email: 'minh.hoang@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 9,
    name: 'Nam Pham',
    email: 'nam.pham@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: 10,
    name: 'Phuong Dang',
    email: 'phuong.dang@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
  },
  {
    id: 11,
    name: 'Quan Bui',
    email: 'quan.bui@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 12,
    name: 'Thao Nguyen',
    email: 'thao.nguyen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 13,
    name: 'Tuan Le',
    email: 'tuan.le@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 14,
    name: 'Vy Ho',
    email: 'vy.ho@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 15,
    name: 'Yen Do',
    email: 'yen.do@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 16,
    name: 'Long Tran',
    email: 'long.tran@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
  },
  {
    id: 17,
    name: 'Mai Pham',
    email: 'mai.pham@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=17',
  },
  {
    id: 18,
    name: 'Son Nguyen',
    email: 'son.nguyen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=18',
  },
  {
    id: 19,
    name: 'Trang Vu',
    email: 'trang.vu@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=19',
  },
  {
    id: 20,
    name: 'Tien Hoang',
    email: 'tien.hoang@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 21,
    name: 'Hieu Le',
    email: 'hieu.le@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=21',
  },
  {
    id: 22,
    name: 'Ngoc Tran',
    email: 'ngoc.tran@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=22',
  },
  {
    id: 23,
    name: 'Phong Bui',
    email: 'phong.bui@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
  },
  {
    id: 24,
    name: 'Quynh Anh',
    email: 'quynh.anh@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=24',
  },
  {
    id: 25,
    name: 'Duy Khanh',
    email: 'duy.khanh@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: 26,
    name: 'Bao Chau',
    email: 'bao.chau@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=26',
  },
  {
    id: 27,
    name: 'Gia Han',
    email: 'gia.han@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=27',
  },
  {
    id: 28,
    name: 'Hoang Nam',
    email: 'hoang.nam@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=28',
  },
  {
    id: 29,
    name: 'Thanh Thao',
    email: 'thanh.thao@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=29',
  },
  {
    id: 30,
    name: 'Minh Anh',
    email: 'minh.anh@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=30',
  },
];

const MOCK_MONTHS = ['2024-08', '2024-09', '2024-10', '2024-11'];

function randomScore(): number {
  return Math.floor(Math.random() * 1000);
}

function buildBoard(id: number, month: string, totalUsers: number): Board {
  const ranked = MOCK_USERS.map((user) => ({
    user,
    score: randomScore(),
  })).sort((a, b) => b.score - a.score);

  return {
    id,
    month,
    users: ranked.slice(0, totalUsers),
  };
}

const boardsData: Board[] = MOCK_MONTHS.map((month, idx) =>
  buildBoard(idx + 1, month, month === '2024-08' ? 28 : 25),
);

export const boardsRouter = t.router({
  list: t.procedure
    .input(pagingSchema.extend({ month: z.string().optional() }))
    .query(async ({ input }) => {
      const { page, limit, month } = input;

      const result = await Promise.all(
        boardsData
          .filter((board) => !month || board.month === month)
          .map(async (board) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
              ...board,
              users: board.users.slice((page - 1) * limit, page * limit),
              totalUsers: board.users.length,
            };
          }),
      );

      return result;
    }),
});
