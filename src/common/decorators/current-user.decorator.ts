import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator personalizado para extraer el usuario autenticado de la request
 * Uso: @CurrentUser() user: Express.Request['user']
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
