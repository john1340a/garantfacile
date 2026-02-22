import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import Stripe from 'stripe';

@Injectable()
export class AbonnementsService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('User not found');

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const existing = await this.prisma.abonnement.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing?.stripeCustomerId) {
      stripeCustomerId = existing.stripeCustomerId;
    } else {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    const priceId =
      dto.plan === 'MENSUEL'
        ? process.env.STRIPE_PRICE_MENSUEL
        : process.env.STRIPE_PRICE_ANNUEL;

    if (!priceId) {
      throw new BadRequestException('Stripe price not configured');
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: { userId, plan: dto.plan },
    });

    // Create pending abonnement record
    await this.prisma.abonnement.create({
      data: {
        userId,
        stripeCustomerId,
        plan: dto.plan,
        status: 'EN_ATTENTE',
      },
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutComplete(session);
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionUpdate(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(sub);
        break;
      }
    }

    return { received: true };
  }

  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) return;

    await this.prisma.abonnement.updateMany({
      where: { userId, status: 'EN_ATTENTE' },
      data: {
        stripeSubscriptionId: session.subscription as string,
        status: 'ACTIF',
      },
    });
  }

  private async handleSubscriptionUpdate(sub: Stripe.Subscription) {
    const currentPeriodEnd = new Date(sub.current_period_end * 1000);
    await this.prisma.abonnement.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: {
        status: sub.status === 'active' ? 'ACTIF' : 'EN_ATTENTE',
        currentPeriodEnd,
      },
    });
  }

  private async handleSubscriptionDeleted(sub: Stripe.Subscription) {
    await this.prisma.abonnement.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: 'ANNULE' },
    });
  }

  async getMyAbonnement(userId: string) {
    return this.prisma.abonnement.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelSubscription(userId: string) {
    const abonnement = await this.prisma.abonnement.findFirst({
      where: { userId, status: 'ACTIF' },
    });
    if (!abonnement) throw new NotFoundException('Active subscription not found');

    if (abonnement.stripeSubscriptionId) {
      await this.stripe.subscriptions.cancel(abonnement.stripeSubscriptionId);
    }

    return this.prisma.abonnement.update({
      where: { id: abonnement.id },
      data: { status: 'ANNULE' },
    });
  }
}
