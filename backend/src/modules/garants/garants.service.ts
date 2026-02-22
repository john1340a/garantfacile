import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGarantDto, UpdateGarantDto } from './dto/garant.dto';
import axios from 'axios';

@Injectable()
export class GarantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { disponible?: boolean; minScore?: number }) {
    return this.prisma.garant.findMany({
      where: {
        verified: true,
        ...(filters?.disponible !== undefined && { disponible: filters.disponible }),
        ...(filters?.minScore !== undefined && { score: { gte: filters.minScore } }),
        user: { deletedAt: null },
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, createdAt: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const garant = await this.prisma.garant.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!garant) throw new NotFoundException('Guarantor not found');
    return garant;
  }

  async findByUser(userId: string) {
    return this.prisma.garant.findUnique({
      where: { userId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async create(userId: string, dto: CreateGarantDto) {
    const existing = await this.prisma.garant.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Guarantor profile already exists');

    return this.prisma.garant.create({
      data: {
        userId,
        profession: dto.profession,
        revenuAnnuel: dto.revenuAnnuel,
      },
    });
  }

  async update(userId: string, dto: UpdateGarantDto) {
    const garant = await this.prisma.garant.findUnique({ where: { userId } });
    if (!garant) throw new NotFoundException('Guarantor profile not found');

    return this.prisma.garant.update({
      where: { userId },
      data: dto,
    });
  }

  async verify(garantId: string) {
    const garant = await this.prisma.garant.findUnique({ where: { id: garantId } });
    if (!garant) throw new NotFoundException('Guarantor not found');

    // Call GarantFacile verification API (with mock fallback)
    let verificationId: string;
    try {
      const apiUrl = process.env.GARANTFACILE_API_URL;
      const apiKey = process.env.GARANTFACILE_API_KEY;

      if (apiUrl && apiKey) {
        const response = await axios.post(
          `${apiUrl}/verify`,
          { garantId },
          { headers: { Authorization: `Bearer ${apiKey}` } },
        );
        verificationId = response.data.verificationId;
      } else {
        // Mock verification for development
        verificationId = `mock-verification-${Date.now()}`;
      }
    } catch {
      verificationId = `mock-verification-${Date.now()}`;
    }

    // Calculate a basic score based on revenue
    const score = garant.revenuAnnuel
      ? Math.min(100, Math.floor(garant.revenuAnnuel / 10000))
      : 50;

    return this.prisma.garant.update({
      where: { id: garantId },
      data: { verified: true, verificationId, score },
    });
  }
}
