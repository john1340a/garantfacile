import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConsentDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  consentMarketing?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  consentRgpd?: boolean;
}
