import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AbonnementsService } from './abonnements.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('abonnements')
@Controller('abonnements')
export class AbonnementsController {
  constructor(private readonly abonnementsService: AbonnementsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  createCheckout(@Request() req, @Body() dto: CreateCheckoutDto) {
    return this.abonnementsService.createCheckout(req.user.id, dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.abonnementsService.handleWebhook(signature, req.rawBody as Buffer);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my current subscription' })
  getMyAbonnement(@Request() req) {
    return this.abonnementsService.getMyAbonnement(req.user.id);
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel my subscription' })
  cancel(@Request() req) {
    return this.abonnementsService.cancelSubscription(req.user.id);
  }
}
