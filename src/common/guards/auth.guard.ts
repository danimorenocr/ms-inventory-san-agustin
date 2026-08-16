import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token format');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // ✔ lo guardamos en req.user
      console.log("🔐 Usuario en token:", decoded);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
