import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentsProcessor } from './documents.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'documents' }),
    MulterModule.register({ dest: process.env.UPLOAD_DIR || './uploads' }),
  ],
  providers: [DocumentsService, DocumentsProcessor],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
