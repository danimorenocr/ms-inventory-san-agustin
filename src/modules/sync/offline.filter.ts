import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro de errores genérico.
 *
 * Con el patrón offline-first puro, todos los repositorios ya escriben en SQLite local.
 * Los errores de conexión a Railway sólo afectan al SyncService (background),
 * así que ya NO necesitamos interceptar errores de red aquí.
 */
@Catch()
export class OfflineFilter implements ExceptionFilter {
  private readonly logger = new Logger(OfflineFilter.name);

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse ? exception.getResponse() : null;

    const message =
      exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? (exceptionResponse as any).message
        : exception.message || 'Internal server error';

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
