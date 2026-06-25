import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { syncContext } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class SyncMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const useCloud = req.headers['x-target-cloud'] === 'true';
    console.log(`[SyncMiddleware] Path: ${req.url}, x-target-cloud: ${req.headers['x-target-cloud']}, useCloud: ${useCloud}`);
    syncContext.run({ useCloud }, () => {
      next();
    });
  }
}
