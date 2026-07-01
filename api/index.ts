import { createVercelHandler } from '../backend/src/serverless';

export default async function handler(request: unknown, response: unknown): Promise<void> {
  const server = await createVercelHandler();
  server(request as never, response as never);
}
