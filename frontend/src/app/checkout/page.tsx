'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAuthToken } from '@/lib/auth';

const PLANS = [
  {
    type: 'MENSUEL',
    name: 'Mensuel',
    price: '29€',
    period: '/mois',
    description: 'Parfait pour commencer',
    features: ['Accès garants vérifiés', 'Filigranage documents', 'Support email'],
  },
  {
    type: 'ANNUEL',
    name: 'Annuel',
    price: '249€',
    period: '/an',
    description: '2 mois offerts',
    features: ['Tout le plan mensuel', 'Support prioritaire', 'Vérification identité', 'Export RGPD'],
    recommended: true,
  },
];

export default function CheckoutPage() {
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
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header
        style={{
          background: '#1e40af',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <Link href="/" style={{ color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>
          🏠 GarantFacile
        </Link>
      </header>

      <div
        style={{
          maxWidth: '800px',
          margin: '3rem auto',
          padding: '0 1rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Choisissez votre abonnement
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem' }}>
          Accédez à tous nos garants vérifiés et services premium
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {PLANS.map((plan) => (
            <div
              key={plan.type}
              onClick={() => setSelectedPlan(plan.type)}
              style={{
                background: 'white',
                border: `3px solid ${selectedPlan === plan.type ? '#1e40af' : '#e5e7eb'}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                width: '280px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s',
              }}
            >
              {plan.recommended && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1e40af',
                    color: 'white',
                    padding: '0.2rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}
                >
                  RECOMMANDÉ
                </div>
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{plan.name}</h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {plan.description}
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#1e40af',
                  marginBottom: '0.25rem',
                }}
              >
                {plan.price}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {plan.period}
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left' }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.3rem 0',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.type && (
                <div
                  style={{
                    marginTop: '1rem',
                    background: '#1e40af',
                    color: 'white',
                    borderRadius: '0.375rem',
                    padding: '0.4rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  ✓ Sélectionné
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '0.5rem',
              padding: '1rem',
              color: '#b91c1c',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            background: loading ? '#93c5fd' : '#1e40af',
            color: 'white',
            border: 'none',
            padding: '1rem 3rem',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          {loading ? 'Redirection vers le paiement...' : `Souscrire au plan ${selectedPlan === 'MENSUEL' ? 'Mensuel (29€/mois)' : 'Annuel (249€/an)'}`}
        </button>

        <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          🔒 Paiement sécurisé par Stripe. Annulable à tout moment.
        </p>

        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          En souscrivant, vous acceptez nos{' '}
          <Link href="/rgpd">conditions d&apos;utilisation et notre politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
