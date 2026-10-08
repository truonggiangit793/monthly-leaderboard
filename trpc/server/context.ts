export interface WebTRPCContext {
  apiBaseUrl: string;
}

export async function createTRPCContext(): Promise<WebTRPCContext> {
  const apiBaseUrl = (process.env.API_BASE_URL ?? 'http://127.0.0.1:4010').replace(
    /\/$/,
    '',
  );
  return { apiBaseUrl };
}
