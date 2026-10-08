/* eslint-disable @next/next/no-img-element */

'use client';

import Loading from '@/app/_components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const MONTHS = ['2024-08', '2024-09', '2024-10', '2024-11'];

const LIMIT = 10;

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  return `${m}/${year}`;
}

function rankStyle(rank: number) {
  if (rank === 1) return 'bg-green-400 text-green-950';
  if (rank === 2) return 'bg-orange-300 text-orange-800';
  if (rank === 3) return 'bg-slate-300 text-slate-950';
  return 'bg-muted text-muted-foreground';
}

export default function Home() {
  const [month, setMonth] = useState('2024-08');
  const [page, setPage] = useState(1);

  const boards = useQuery({
    queryKey: ['public-boards', month, page],
    queryFn: () => trpc.public.boards.list.query({ page, limit: LIMIT, month }),
  });

  const users = boards.data?.[0]?.users ?? [];
  const hasMore = users.length === LIMIT;

  const handleMonthChange = (value: unknown) => {
    if (typeof value !== 'string') return;
    setMonth(value);
    setPage(1);
  };

  return (
    <div className='flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-10 font-sans dark:bg-black'>
      <div className='w-full max-w-2xl space-y-4'>
        <div className='space-y-1 text-center'>
          <h1 className='text-2xl font-bold'>Bảng xếp hạng tháng</h1>
        </div>

        <Tabs value={month} onValueChange={handleMonthChange}>
          <TabsList className='flex h-auto w-full flex-wrap'>
            {MONTHS.map((m) => (
              <TabsTrigger key={m} value={m}>
                {formatMonth(m)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Card>
          <CardContent>
            {boards.isLoading ? (
              <Loading />
            ) : boards.isError ? (
              <p className='text-destructive py-8 text-center text-sm'>
                Không tải được dữ liệu. Vui lòng thử lại.
              </p>
            ) : users.length === 0 ? (
              <p className='text-muted-foreground py-8 text-center text-sm'>
                Chưa có dữ liệu xếp hạng cho tháng này.
              </p>
            ) : (
              <ul className='divide-y'>
                {users.map((entry, i) => {
                  const rank = (page - 1) * LIMIT + i + 1;
                  return (
                    <li key={entry.user.id} className='flex items-center gap-3 py-3'>
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankStyle(rank)}`}
                      >
                        {rank}
                      </span>
                      {entry.user.avatarUrl ? (
                        <img
                          src={entry.user.avatarUrl}
                          alt={entry.user.name}
                          className='size-10 shrink-0 rounded-full object-cover'
                        />
                      ) : (
                        <span className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-full font-medium'>
                          {entry.user.name.charAt(0)}
                        </span>
                      )}
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium'>{entry.user.name}</p>
                        <p className='text-muted-foreground truncate text-xs'>
                          {entry.user.email}
                        </p>
                      </div>
                      <span className='bg-primary/10 text-primary shrink-0 rounded-full px-2.5 py-1 text-sm font-semibold'>
                        {entry.score}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>

          <CardFooter className='justify-between'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 1 || boards.isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft data-icon='inline-start' />
              Trước
            </Button>
            <span className='text-muted-foreground text-sm'>Trang {page}</span>
            <Button
              variant='outline'
              size='sm'
              disabled={!hasMore || boards.isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
              <ChevronRight data-icon='inline-end' />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
