import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import * as crypto from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('documents') private readonly documentQueue: Queue,
  ) {}

  async upload(
    userId: string,
    file: Express.Multer.File,
    dto: CreateDocumentDto,
  ) {
    // Generate AES key for the document
    const aesKey = crypto.randomBytes(32).toString('hex');
    const encryptedKey = this.encryptAesKey(aesKey);

    const document = await this.prisma.document.create({
      data: {
        userId,
        type: dto.type,
        filename: file.originalname,
        originalPath: file.path,
        status: 'PENDING',
        encryptedKey,
      },
    });

    // Queue watermarking job
    await this.documentQueue.add('watermark', {
      documentId: document.id,
      filePath: file.path,
      userId,
    });

    return document;
  }

  async findAll(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id, userId },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async delete(id: string, userId: string) {
    const doc = await this.prisma.document.findFirst({ where: { id, userId } });
    if (!doc) throw new NotFoundException('Document not found');
    return this.prisma.document.delete({ where: { id } });
  }

  private encryptAesKey(key: string): string {
    const rawKey = process.env.AES_ENCRYPTION_KEY;
    if (!rawKey) throw new Error('AES_ENCRYPTION_KEY environment variable is not set');
    const masterKey = Buffer.from(rawKey.padEnd(32).slice(0, 32));
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
    const encrypted = Buffer.concat([cipher.update(key, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }
}
