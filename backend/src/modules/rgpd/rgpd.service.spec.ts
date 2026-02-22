import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RgpdService } from './rgpd.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockUser = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  passwordHash: 'hashedpwd',
  encryptedData: null,
  garant: null,
  documents: [],
  abonnements: [],
  consentLogs: [],
  auditLogs: [],
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  consentLog: {
    findMany: jest.fn(),
    createMany: jest.fn(),
  },
  auditLog: {
    updateMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('RgpdService', () => {
  let service: RgpdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RgpdService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RgpdService>(RgpdService);
    jest.clearAllMocks();
  });

  describe('exportUserData', () => {
    it('should export user data without sensitive fields', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.exportUserData('user-uuid-1');

      expect(result).toHaveProperty('exportedAt');
      expect(result.data).not.toHaveProperty('passwordHash');
      expect(result.data).not.toHaveProperty('encryptedData');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.exportUserData('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUserData', () => {
    it('should anonymize and soft delete user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrismaService.$transaction.mockResolvedValueOnce([]);

      const result = await service.deleteUserData('user-uuid-1');

      expect(result).toHaveProperty('message', 'User data deleted successfully');
      expect(result.anonymizedEmail).toContain('@deleted.local');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteUserData('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateConsent', () => {
    it('should update consent and log it', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrismaService.user.update.mockResolvedValueOnce({});
      mockPrismaService.consentLog.createMany.mockResolvedValueOnce({});

      const result = await service.updateConsent(
        'user-uuid-1',
        { consentMarketing: true },
        '127.0.0.1',
        'Mozilla/5.0',
      );

      expect(result.consents).toEqual({ consentMarketing: true });
      expect(mockPrismaService.consentLog.createMany).toHaveBeenCalled();
    });
  });

  describe('encryptSensitiveData / decryptSensitiveData', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const originalData = 'sensitive-information-123';
      process.env.AES_ENCRYPTION_KEY = 'test-key-32-characters-long-here';

      const encrypted = await service.encryptSensitiveData(originalData);
      expect(encrypted).not.toBe(originalData);
      expect(encrypted).toContain(':');

      const decrypted = await service.decryptSensitiveData(encrypted);
      expect(decrypted).toBe(originalData);
    });
  });
});
