import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete my account (GDPR)' })
  deleteMe(@Request() req) {
    return this.usersService.softDelete(req.user.id);
  }
}
