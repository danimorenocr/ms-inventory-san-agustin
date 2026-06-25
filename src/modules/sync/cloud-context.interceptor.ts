import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { syncContext } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class CloudContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const useCloud = req.headers['x-target-cloud'] === 'true';

    // Usamos enterWith() porque NestJS pierde el contexto de AsyncLocalStorage.run()
    // en ciertas cadenas de Promesas complejas. enterWith() transiciona el
    // recurso asíncrono actual a este contexto permanentemente para esta petición.
    syncContext.enterWith({ useCloud });

    return next.handle();
  }
}
