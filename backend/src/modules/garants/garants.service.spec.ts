import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { GarantsService } from './garants.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockGarant = {
  id: 'garant-uuid-1',
  userId: 'user-uuid-1',
  verified: false,
  verificationId: null,
  profession: 'Ingénieur',
  revenuAnnuel: 60000,
  score: 60,
  disponible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  garant: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('GarantsService', () => {
  let service: GarantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GarantsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GarantsService>(GarantsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return list of verified guarantors', async () => {
      mockPrismaService.garant.findMany.mockResolvedValueOnce([mockGarant]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockPrismaService.garant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ verified: true }) }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a guarantor by ID', async () => {
      mockPrismaService.garant.findUnique.mockResolvedValueOnce(mockGarant);

      const result = await service.findOne('garant-uuid-1');
      expect(result.id).toBe('garant-uuid-1');
    });

    it('should throw NotFoundException if guarantor not found', async () => {
      mockPrismaService.garant.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new guarantor profile', async () => {
      mockPrismaService.garant.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.garant.create.mockResolvedValueOnce(mockGarant);

      const result = await service.create('user-uuid-1', {
        profession: 'Ingénieur',
        revenuAnnuel: 60000,
      });

      expect(result).toEqual(mockGarant);
      expect(mockPrismaService.garant.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if profile already exists', async () => {
      mockPrismaService.garant.findUnique.mockResolvedValueOnce(mockGarant);

      await expect(
        service.create('user-uuid-1', { profession: 'Ingénieur' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update guarantor profile', async () => {
      mockPrismaService.garant.findUnique.mockResolvedValueOnce(mockGarant);
      mockPrismaService.garant.update.mockResolvedValueOnce({
        ...mockGarant,
        disponible: false,
      });

      const result = await service.update('user-uuid-1', { disponible: false });
      expect(result.disponible).toBe(false);
    });

    it('should throw NotFoundException if profile not found', async () => {
      mockPrismaService.garant.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update('user-uuid-1', { disponible: false }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
