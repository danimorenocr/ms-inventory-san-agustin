import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { syncContext } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class SyncMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const useCloud = req.headers['x-target-cloud'] === 'true';
    syncContext.run({ useCloud }, () => {
      next();
    });
  }
}
