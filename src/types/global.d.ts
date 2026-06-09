// Extensión de tipos para Express Request
declare namespace Express {
    export interface Request {
        user?: {
            sub: number;      // User ID (from JWT 'sub' claim)
            cedula: string;
            rol: any;
            iat?: number;     // Issued at
            exp?: number;     // Expiration
        };
    }
}
