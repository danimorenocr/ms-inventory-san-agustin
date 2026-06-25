import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SyncService } from './sync.service';

@Injectable()
export class CloudSyncInterceptor implements NestInterceptor {
  constructor(private readonly syncService: SyncService) {}

  // Rutas que NO deben sincronizarse
  private readonly EXCLUDED_PATHS = ['/health'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    
    const isExcluded = this.EXCLUDED_PATHS.some(p => req.url.includes(p));
    
    // Solo interceptar mutaciones, no replays de SyncService, y no rutas excluidas
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers['x-target-cloud'] !== 'true' && !isExcluded) {
      return next.handle().pipe(
        tap(() => {
          // Normal local execution succeeded. Now queue for the cloud.
          const payload = {
            url: req.url,
            method: req.method,
            body: req.body,
            headers: {
              authorization: req.headers.authorization // Capture JWT for replay
            }
          };
          
          // Guardar en la cola sin bloquear la respuesta al usuario
          this.syncService.saveToSyncQueue('HttpRequest', req.method, payload).catch(err => {
            console.error('Error guardando en SyncQueue:', err);
          });
        })
      );
    }
    
    return next.handle();
  }
}
