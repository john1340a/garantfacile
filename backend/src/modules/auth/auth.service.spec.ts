import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  passwordHash: '$2b$12$hashedpassword',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'LOCATAIRE',
  consentRgpd: true,
  consentMarketing: false,
  deletedAt: null,
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  consentLog: {
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw BadRequestException if GDPR consent not given', async () => {
      await expect(
        service.register({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Jean',
          lastName: 'Dupont',
          consentRgpd: false,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Jean',
          lastName: 'Dupont',
          consentRgpd: true,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a user and return tokens', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce(mockUser);
      mockPrismaService.consentLog.create.mockResolvedValueOnce({});

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Jean',
        lastName: 'Dupont',
        consentRgpd: true,
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on successful login', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe('test@example.com');
    });
  });
});
