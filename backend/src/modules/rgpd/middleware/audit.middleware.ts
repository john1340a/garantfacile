import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Skip swagger and health endpoints
    if (req.path.startsWith('/api/docs') || req.path === '/api/health') {
      return next();
    }

    const user = (req as any).user;
    const ipAddress = req.ip || req.socket?.remoteAddress;
    const action = `${req.method} ${req.path}`;

    // Log asynchronously without blocking the request
    this.prisma.auditLog
      .create({
        data: {
          userId: user?.id || null,
          action,
          resource: req.path,
          details: JSON.stringify({
            query: req.query,
            params: req.params,
          }),
          ipAddress,
        },
      })
      .catch((err) => {
        // Audit log failure must not disrupt the request, but should be logged for visibility
        console.error('[AuditMiddleware] Failed to write audit log:', err?.message);
      });

    next();
  }
}
