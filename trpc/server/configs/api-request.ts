import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import type { WebTRPCContext } from '../context';

const publicErrorByStatus: Record<number, { code: TRPCError['code']; message: string }> =
  {
    400: { code: 'BAD_REQUEST', message: 'Invalid public API request' },
    404: { code: 'NOT_FOUND', message: 'Resource not found' },
  };

export const apiErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string().optional(),
});

export async function apiRequest(
  ctx: WebTRPCContext,
  path: string,
  init: RequestInit = {},
) {
  let response: Response;
  try {
    response = await fetch(ctx.apiBaseUrl + path, {
      ...init,
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new TRPCError({
      code: 'SERVICE_UNAVAILABLE',
      message: 'Public API unavailable',
    });
  }

  const body = await response.json().catch(() => null);
  if (response.ok) return body;

  const knownError =
    publicErrorByStatus[response.status] ??
    {
      401: { code: 'UNAUTHORIZED' as const, message: 'Authentication is required' },
      403: { code: 'FORBIDDEN' as const, message: 'The action is not allowed' },
      429: { code: 'TOO_MANY_REQUESTS' as const, message: 'Too many requests' },
    }[response.status];
  const parsedError = apiErrorResponseSchema.safeParse(body);
  const hasValidationIssues = parsedError.success;
  const apiCode = parsedError.success ? parsedError.data.code : undefined;

  throw new TRPCError({
    code: knownError?.code ?? 'INTERNAL_SERVER_ERROR',
    message:
      apiCode === 'EMAIL_NOT_CONFIRMED'
        ? 'EMAIL_NOT_CONFIRMED'
        : (knownError?.message ??
          (hasValidationIssues
            ? 'Invalid public API request'
            : 'Public API unavailable')),
  });
}
