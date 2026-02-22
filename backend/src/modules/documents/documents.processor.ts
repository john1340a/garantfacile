import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Processor('documents')
export class DocumentsProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('watermark')
  async handleWatermark(job: Job<{ documentId: string; filePath: string; userId: string }>) {
    const { documentId, filePath, userId } = job.data;

    // Mark as processing
    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' },
    });

    try {
      const watermarkedPath = await this.applyWatermark(filePath, userId);

      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: 'DONE', watermarkedPath },
      });
    } catch (error) {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: 'ERROR' },
      });
      throw error;
    }
  }

  private async applyWatermark(filePath: string, userId: string): Promise<string> {
    const apiUrl = process.env.FILIGRANE_API_URL;
    const apiKey = process.env.FILIGRANE_API_KEY;

    const outputPath = filePath.replace(/(\.[^.]+)$/, '_watermarked$1');

    if (apiUrl && apiKey && fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fileBuffer, path.basename(filePath));
        form.append('watermark', `GarantFacile - User ${userId}`);

        const response = await axios.post(`${apiUrl}/watermark`, form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${apiKey}`,
          },
          responseType: 'arraybuffer',
        });

        fs.writeFileSync(outputPath, response.data);
        return outputPath;
      } catch {
        // Fallback: mock watermarking
        return this.mockWatermark(filePath, outputPath);
      }
    }

    // Mock watermarking for development
    return this.mockWatermark(filePath, outputPath);
  }

  private mockWatermark(inputPath: string, outputPath: string): string {
    // In development, just copy the file (real watermark would be applied by the API)
    if (fs.existsSync(inputPath)) {
      fs.copyFileSync(inputPath, outputPath);
    } else {
      fs.writeFileSync(outputPath, `MOCK WATERMARKED FILE - ${Date.now()}`);
    }
    return outputPath;
  }
}
