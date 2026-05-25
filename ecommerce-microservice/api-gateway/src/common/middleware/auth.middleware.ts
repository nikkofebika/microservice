import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // This middleware could be used to pre-process user info if needed
    // But since we use Guard for validation, we'll mostly use that.
    next();
  }
}
