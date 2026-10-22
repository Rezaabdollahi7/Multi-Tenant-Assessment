import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/** A single request cookie by name, or undefined when absent. */
export const Cookie = createParamDecorator(
  (name: string, ctx: ExecutionContext): string | undefined => {
    const cookies = ctx.switchToHttp().getRequest<Request>().cookies as
      Record<string, string> | undefined;
    return cookies?.[name];
  },
);
