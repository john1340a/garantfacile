import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';

export class CreateCheckoutDto {
  @ApiProperty({ enum: PlanType })
  @IsEnum(PlanType)
  plan: PlanType;
}
