import { Controller, Get, Delete, Put, Body, UseGuards, Request, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RgpdService } from './rgpd.service';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rgpd')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rgpd')
export class RgpdController {
  constructor(private readonly rgpdService: RgpdService) {}

  @Get('export')
  @ApiOperation({ summary: 'Export all personal data (ARCO right of access)' })
  export(@Request() req) {
    return this.rgpdService.exportUserData(req.user.id);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete all personal data (ARCO right to erasure)' })
  delete(@Request() req) {
    return this.rgpdService.deleteUserData(req.user.id);
  }

  @Put('consent')
  @ApiOperation({ summary: 'Update consent preferences' })
  updateConsent(
    @Request() req,
    @Body() dto: UpdateConsentDto,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    const ip = forwardedFor || req.ip || 'unknown';
    return this.rgpdService.updateConsent(req.user.id, dto, ip, userAgent || 'unknown');
  }

  @Get('consent/history')
  @ApiOperation({ summary: 'Get consent change history' })
  consentHistory(@Request() req) {
    return this.rgpdService.getConsentHistory(req.user.id);
  }
}
