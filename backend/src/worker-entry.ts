// Worker entry placed inside src so TypeScript emits it to dist
import { createApp } from './app.js';

let _app: ReturnType<typeof createApp> | null = null;

export const fetch = async (
  request: Request,
  env: Record<string, unknown>,
  ctx: unknown
) => {
  if (!_app) {
    const allowed =
      typeof env?.ALLOWED_ORIGINS === 'string' && env.ALLOWED_ORIGINS
        ? (env.ALLOWED_ORIGINS as string)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
    _app = createApp(allowed);
  }
  // @ts-ignore - Hono app fetch signature
  return _app.fetch(request, env, ctx);
};

export default { fetch };
