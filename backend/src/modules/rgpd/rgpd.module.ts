import { Module } from '@nestjs/common';
import { RgpdService } from './rgpd.service';
import { RgpdController } from './rgpd.controller';
import { AuditMiddleware } from './middleware/audit.middleware';

@Module({
  providers: [RgpdService, AuditMiddleware],
  controllers: [RgpdController],
  exports: [RgpdService, AuditMiddleware],
})
export class RgpdModule {}
