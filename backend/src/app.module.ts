import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GarantsModule } from './modules/garants/garants.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AbonnementsModule } from './modules/abonnements/abonnements.module';
import { RgpdModule } from './modules/rgpd/rgpd.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuditMiddleware } from './modules/rgpd/middleware/audit.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    GarantsModule,
    DocumentsModule,
    AbonnementsModule,
    RgpdModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*');
  }
}
