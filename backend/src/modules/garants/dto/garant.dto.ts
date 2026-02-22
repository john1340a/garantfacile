import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGarantDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  revenuAnnuel?: number;
}

export class UpdateGarantDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  revenuAnnuel?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
