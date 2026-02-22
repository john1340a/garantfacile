'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';

interface Garant {
  id: string;
  profession: string;
  revenuAnnuel: number;
  score: number;
  disponible: boolean;
  user: { firstName: string; lastName: string };
}

interface Document {
  id: string;
  type: string;
  filename: string;
  status: string;
  createdAt: string;
}

interface Abonnement {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

export default function DashboardPage() {
  const [garants, setGarants] = useState<Garant[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchData(token);
  }, []);

  async function fetchData(token: string) {
    try {
      const [garantsRes, docsRes, abonnementRes, userRes] = await Promise.allSettled([
        apiClient.get('/garants', token),
        apiClient.get('/documents', token),
        apiClient.get('/abonnements/my', token),
        apiClient.get('/users/me', token),
      ]);

      if (garantsRes.status === 'fulfilled') setGarants(garantsRes.value);
      if (docsRes.status === 'fulfilled') setDocuments(docsRes.value);
      if (abonnementRes.status === 'fulfilled') setAbonnement(abonnementRes.value);
      if (userRes.status === 'fulfilled') setUser(userRes.value);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DONE: '#10b981',
      PROCESSING: '#f59e0b',
      PENDING: '#6b7280',
      ERROR: '#ef4444',
      ACTIF: '#10b981',
      ANNULE: '#ef4444',
      EN_ATTENTE: '#f59e0b',
    };
    return (
      <span
        style={{
          background: colors[status] || '#6b7280',
          color: 'white',
          padding: '0.15rem 0.6rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header
        style={{
          background: '#1e40af',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/" style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700' }}>
          🏠 GarantFacile
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/rgpd" style={{ color: 'white', fontSize: '0.9rem' }}>
            Mes droits RGPD
          </Link>
          <span style={{ color: '#bfdbfe' }}>
            {user ? `Bonjour, ${user.firstName}` : 'Dashboard'}
          </span>
        </nav>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Subscription status */}
        {abonnement && (
          <div
            style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Mon abonnement</h3>
              <p style={{ color: '#6b7280' }}>
                Plan {abonnement.plan} •{' '}
                {abonnement.currentPeriodEnd
                  ? `Renouvellement le ${new Date(abonnement.currentPeriodEnd).toLocaleDateString('fr-FR')}`
                  : ''}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {statusBadge(abonnement.status)}
              <Link
                href="/checkout"
                style={{
                  background: '#1e40af',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.9rem',
                }}
              >
                Gérer
              </Link>
            </div>
          </div>
        )}

        {!abonnement && (
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontWeight: '700', color: '#1e40af' }}>Aucun abonnement actif</h3>
              <p style={{ color: '#3b82f6' }}>Souscrivez pour accéder à tous nos garants vérifiés.</p>
            </div>
            <Link
              href="/checkout"
              style={{
                background: '#1e40af',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
              }}
            >
              S&apos;abonner
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Guarantors list */}
          <section
            style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Garants disponibles ({garants.length})
            </h2>
            {garants.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                Aucun garant disponible actuellement.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {garants.slice(0, 5).map((g) => (
                  <Link
                    key={g.id}
                    href={`/garant/${g.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      border: '1px solid #f3f4f6',
                      borderRadius: '0.5rem',
                      color: 'inherit',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600' }}>
                        {g.user.firstName} {g.user.lastName[0]}.
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {g.profession} • {g.revenuAnnuel?.toLocaleString('fr-FR')}€/an
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                        }}
                      >
                        Score: {g.score}/100
                      </span>
                      {g.disponible && (
                        <span style={{ color: '#10b981', fontSize: '0.75rem' }}>✓ Dispo</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Documents */}
          <section
            style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Mes documents ({documents.length})
            </h2>
            {documents.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                Aucun document téléversé.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: '1px solid #f3f4f6',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{doc.filename}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {doc.type} • {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    {statusBadge(doc.status)}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
