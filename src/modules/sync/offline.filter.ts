import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { SyncService } from './sync.service';

@Catch()
export class OfflineFilter implements ExceptionFilter {
  private readonly logger = new Logger(OfflineFilter.name);

  constructor(private readonly syncService: SyncService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isNetworkError =
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception.message?.includes('Connection refused') ||
      exception.message?.includes('timed out') ||
      exception.message?.includes('Can\\'t reach database server') ||
      exception.code === 'P1001' ||
      exception.code === 'P1008';

    if (isNetworkError) {
      this.logger.warn(`[OFFLINE] Network error detected on ${request.method} ${request.url}`);

      // Solo guardamos en cola peticiones que modifican estado
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        const payload = {
          url: request.url,
          method: request.method,
          body: request.body,
        };

        try {
          await this.syncService.saveToSyncQueue(
            'HttpRequest', 
            request.method, 
            payload
          );

          return response.status(HttpStatus.ACCEPTED).json({
            success: true,
            offline: true,
            message: 'Sin conexión a la nube. Petición guardada localmente para sincronización posterior.',
          });
        } catch (syncError) {
          this.logger.error('Failed to save to local SyncQueue', syncError);
        }
      } else {
        // Es un GET, no podemos hacer magia si no hay caché, fallamos amablemente
        return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
          success: false,
          offline: true,
          message: 'Sin conexión a la nube. No se pueden obtener datos en este momento.',
        });
      }
    }

    // Si no es un error de red, pasa el error normalmente
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    });
  }
}
