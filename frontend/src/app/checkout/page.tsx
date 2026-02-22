'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Divider, 
  Spacer, 
  Chip,
  cn
} from '@heroui/react';
import { getAuthToken } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';

const PLANS = [
  {
    type: 'MENSUEL',
    name: 'Mensuel',
    price: '29',
    period: 'mois',
    description: 'Parfait pour commencer votre recherche',
    features: ['Accès garants vérifiés', 'Filigranage documents', 'Support email'],
    icon: 'rocket_launch'
  },
  {
    type: 'ANNUEL',
    name: 'Annuel',
    price: '249',
    period: 'an',
    description: 'La solution la plus économique (2 mois offerts)',
    features: ['Tout le plan mensuel', 'Support prioritaire', 'Vérification identité', 'Export de données sécurisé'],
    recommended: true,
    icon: 'auto_awesome'
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get('plan') || 'ANNUEL';
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/abonnements/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la création du paiement');
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 pt-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
            Prêt à sécuriser votre location ?
          </h1>
          <p className="text-xl text-default-500 max-w-2xl mx-auto">
            Choisissez l'abonnement qui vous ressemble et accédez à nos meilleurs garants en quelques secondes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {PLANS.map((plan) => (
            <Card
              key={plan.type}
              isPressable
              onPress={() => setSelectedPlan(plan.type)}
              className={cn(
                "border-2 transition-all duration-300 relative overflow-visible",
                selectedPlan === plan.type 
                  ? "border-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
                  : "border-transparent bg-default-50 hover:bg-default-100"
              )}
            >
              {plan.recommended && (
                <Chip
                  color="primary"
                  variant="shadow"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 uppercase font-bold px-4 py-1 z-20"
                  size="sm"
                >
                  Conseillé
                </Chip>
              )}
              
              <CardHeader className="flex flex-col gap-2 p-8">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
                  selectedPlan === plan.type ? "bg-primary text-white" : "bg-default-200 text-default-600"
                )}>
                  <span className="material-symbols-outlined">{plan.icon}</span>
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-default-500 text-small">{plan.description}</p>
              </CardHeader>
              
              <Divider />
              
              <CardBody className="p-8">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black text-primary">{plan.price}€</span>
                  <span className="text-default-500 font-medium">/{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-default-600">
                      <span className="material-symbols-outlined text-success">check_circle</span>
                      <span className="text-small font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                
                <div className={cn(
                  "p-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-opacity",
                  selectedPlan === plan.type ? "bg-primary/10 text-primary opacity-100" : "opacity-0"
                )}>
                  <span className="material-symbols-outlined text-small">check</span>
                    Plan sélectionné
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {error && (
            <Card className="bg-danger/10 border-danger/20" shadow="none">
              <CardBody className="py-3 px-4 flex flex-row items-center gap-3 text-danger">
                <span className="material-symbols-outlined">error</span>
                <p className="text-small font-medium">{error}</p>
              </CardBody>
            </Card>
          )}

          <Button
            size="lg"
            color="primary"
            variant="shadow"
            className="btn-shiny w-full text-lg font-bold h-16 shadow-lg shadow-primary-200"
            isLoading={loading}
            onPress={handleCheckout}
            endContent={!loading && <span className="material-symbols-outlined">arrow_forward</span>}
          >
            {loading ? 'Redirection...' : `Passer au paiement (${PLANS.find(p => p.type === selectedPlan)?.price}€)`}
          </Button>

          <footer className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-default-400">
              <div className="flex items-center gap-1 text-tiny uppercase font-bold tracking-widest">
                <span className="material-symbols-outlined text-small text-success">lock</span>
                Stripe Secure
              </div>
              <div className="flex items-center gap-1 text-tiny uppercase font-bold tracking-widest">
                <span className="material-symbols-outlined text-small text-warning">event_repeat</span>
                Annulable
              </div>
            </div>
            
            <p className="text-tiny text-default-400 leading-relaxed">
              En souscrivant, vous acceptez nos{' '}
              <Link href="/rgpd" className="text-primary hover:underline font-medium">conditions d&apos;utilisation</Link>
              {' '}et notre{' '}
              <Link href="/rgpd" className="text-primary hover:underline font-medium">politique de confidentialité</Link>.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Button isLoading variant="light" color="primary">Chargement...</Button>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
