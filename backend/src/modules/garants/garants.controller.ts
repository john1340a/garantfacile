import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GarantsService } from './garants.service';
import { CreateGarantDto, UpdateGarantDto } from './dto/garant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('garants')
@Controller('garants')
export class GarantsController {
  constructor(private readonly garantsService: GarantsService) {}

  @Get()
  @ApiOperation({ summary: 'List all verified guarantors' })
  @ApiQuery({ name: 'disponible', required: false, type: Boolean })
  @ApiQuery({ name: 'minScore', required: false, type: Number })
  findAll(
    @Query('disponible') disponible?: string,
    @Query('minScore') minScore?: string,
  ) {
    return this.garantsService.findAll({
      disponible: disponible !== undefined ? disponible === 'true' : undefined,
      minScore: minScore ? parseInt(minScore) : undefined,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my guarantor profile' })
  getMyGarant(@Request() req) {
    return this.garantsService.findByUser(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create my guarantor profile' })
  create(@Request() req, @Body() dto: CreateGarantDto) {
    return this.garantsService.create(req.user.id, dto);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my guarantor profile' })
  update(@Request() req, @Body() dto: UpdateGarantDto) {
    return this.garantsService.update(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guarantor profile by ID' })
  findOne(@Param('id') id: string) {
    return this.garantsService.findOne(id);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger identity verification for a guarantor' })
  verify(@Param('id') id: string) {
    return this.garantsService.verify(id);
  }
}
