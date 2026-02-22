import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface GarantProfileProps {
  params: { id: string };
}

async function getGarant(id: string) {
  try {
    return await apiClient.get(`/garants/${id}`);
  } catch {
    return null;
  }
}

export default async function GarantProfilePage({ params }: GarantProfileProps) {
  const garant = await getGarant(params.id);

  if (!garant) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Garant non trouvé</h1>
        <Link href="/dashboard">Retour au dashboard</Link>
      </div>
    );
  }

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
        <Link href="/dashboard" style={{ color: 'white' }}>
          ← Retour
        </Link>
        <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>🏠 GarantFacile</span>
      </header>

      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: '700',
              }}
            >
              {garant.user?.firstName?.[0] || '?'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                {garant.user?.firstName} {garant.user?.lastName?.[0]}.
              </h1>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {garant.verified ? (
                  <span
                    style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    ✅ Identité vérifiée
                  </span>
                ) : (
                  <span
                    style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                    }}
                  >
                    ⏳ Vérification en cours
                  </span>
                )}
                {garant.disponible && (
                  <span
                    style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                    }}
                  >
                    Disponible
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <InfoCard label="Profession" value={garant.profession || 'Non renseignée'} />
            <InfoCard
              label="Revenu annuel"
              value={
                garant.revenuAnnuel
                  ? `${garant.revenuAnnuel.toLocaleString('fr-FR')} €`
                  : 'Non renseigné'
              }
            />
            <InfoCard label="Score de fiabilité" value={`${garant.score || 0}/100`} />
            <InfoCard
              label="Disponibilité"
              value={garant.disponible ? 'Disponible' : 'Non disponible'}
            />
          </div>

          {/* Security note */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              color: '#1e40af',
            }}
          >
            🔒 Les informations de ce garant ont été vérifiées par GarantFacile. Votre dossier sera
            traité de manière confidentielle et conforme au RGPD.
          </div>

          {/* CTA */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Link
              href="/checkout"
              style={{
                flex: 1,
                display: 'block',
                textAlign: 'center',
                background: '#1e40af',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '1rem',
              }}
            >
              Contacter ce garant
            </Link>
            <Link
              href="/dashboard"
              style={{
                flex: 1,
                display: 'block',
                textAlign: 'center',
                border: '2px solid #e5e7eb',
                color: '#374151',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
              }}
            >
              Voir d&apos;autres garants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: '#f9fafb',
        borderRadius: '0.5rem',
        padding: '1rem',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontWeight: '600' }}>{value}</div>
    </div>
  );
}
