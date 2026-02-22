import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+33612345678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'GDPR consent (required)', example: true })
  @IsBoolean()
  consentRgpd: boolean;

  @ApiProperty({ description: 'Marketing consent (optional)', example: false })
  @IsBoolean()
  @IsOptional()
  consentMarketing?: boolean;
}
