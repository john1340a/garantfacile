import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateConsentDto } from './dto/update-consent.dto';
import * as crypto from 'crypto';

@Injectable()
export class RgpdService {
  constructor(private readonly prisma: PrismaService) {}

  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        garant: true,
        documents: true,
        abonnements: true,
        consentLogs: true,
        auditLogs: { take: 100, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    // Sanitize before export (remove sensitive internal fields)
    const { passwordHash, encryptedData, ...exportData } = user;

    return {
      exportedAt: new Date().toISOString(),
      requestedBy: userId,
      data: exportData,
    };
  }

  async deleteUserData(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // GDPR right to erasure: anonymize and soft delete
    const anonymizedEmail = `deleted-${crypto.randomBytes(8).toString('hex')}@deleted.local`;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          firstName: 'DELETED',
          lastName: 'DELETED',
          phone: null,
          encryptedData: null,
          deletedAt: new Date(),
        },
      }),
      // Keep audit logs for compliance but anonymize them
      this.prisma.auditLog.updateMany({
        where: { userId },
        data: { userId: null, ipAddress: null },
      }),
    ]);

    return { message: 'User data deleted successfully', anonymizedEmail };
  }

  async updateConsent(
    userId: string,
    dto: UpdateConsentDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    // Log each consent change
    const consentLogs = Object.entries(dto).map(([type, value]) => ({
      userId,
      type,
      value: value as boolean,
      ipAddress,
      userAgent,
    }));

    await this.prisma.consentLog.createMany({ data: consentLogs });

    return { message: 'Consent updated', consents: dto };
  }

  async getConsentHistory(userId: string) {
    return this.prisma.consentLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private getAesKey(): Buffer {
    const raw = process.env.AES_ENCRYPTION_KEY;
    if (!raw) throw new Error('AES_ENCRYPTION_KEY environment variable is not set');
    return Buffer.from(raw.padEnd(32).slice(0, 32));
  }

  async encryptSensitiveData(data: string): Promise<string> {
    const key = this.getAesKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  async decryptSensitiveData(encrypted: string): Promise<string> {
    const key = this.getAesKey();
    const [ivHex, tagHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encryptedData = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encryptedData) + decipher.final('utf8');
  }
}
