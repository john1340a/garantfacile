import { Module } from '@nestjs/common';
import { GarantsService } from './garants.service';
import { GarantsController } from './garants.controller';

@Module({
  providers: [GarantsService],
  controllers: [GarantsController],
  exports: [GarantsService],
})
export class GarantsModule {}
