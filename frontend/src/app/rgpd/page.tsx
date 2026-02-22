'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAuthToken } from '@/lib/auth';

export default function RgpdPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [exportData, setExportData] = useState<any>(null);
  const [consent, setConsent] = useState({
    consentMarketing: false,
    consentRgpd: true,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function apiFetch(endpoint: string, method = 'GET', body?: any) {
    const token = getAuthToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const res = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error((await res.json()).message || 'Erreur');
    return res.json();
  }

  const handleExport = async () => {
    setLoading('export');
    setMessage('');
    try {
      const data = await apiFetch('/rgpd/export');
      setExportData(data);
      setMessage('✅ Export généré avec succès');
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) return;
    setLoading('delete');
    setMessage('');
    try {
      const data = await apiFetch('/rgpd/delete', 'DELETE');
      setMessage(`✅ ${data.message}`);
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleConsentUpdate = async () => {
    setLoading('consent');
    setMessage('');
    try {
      await apiFetch('/rgpd/consent', 'PUT', consent);
      setMessage('✅ Préférences de consentement mises à jour');
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setLoading(null);
    }
  };

  const downloadExport = () => {
    if (!exportData) return;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garantfacile-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <Link href="/dashboard" style={{ color: 'white' }}>
          ← Retour
        </Link>
        <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>🏠 GarantFacile</span>
      </header>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Mes droits RGPD
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de
          droits sur vos données personnelles (ARCO : Accès, Rectification, Effacement, Opposition).
        </p>

        {message && (
          <div
            style={{
              background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${message.startsWith('✅') ? '#6ee7b7' : '#fca5a5'}`,
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: message.startsWith('✅') ? '#065f46' : '#b91c1c',
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Right of access */}
          <RightCard
            icon="📂"
            title="Droit d'accès (Article 15 RGPD)"
            description="Téléchargez l'intégralité de vos données personnelles stockées sur GarantFacile."
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleExport}
                disabled={loading === 'export'}
                style={buttonStyle('#1e40af', loading === 'export')}
              >
                {loading === 'export' ? 'Export...' : 'Exporter mes données'}
              </button>
              {exportData && (
                <button onClick={downloadExport} style={buttonStyle('#059669', false)}>
                  Télécharger le fichier JSON
                </button>
              )}
            </div>
          </RightCard>

          {/* Consent management */}
          <RightCard
            icon="⚙️"
            title="Gestion du consentement (Article 7 RGPD)"
            description="Gérez vos préférences de traitement des données personnelles."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent.consentMarketing}
                  onChange={(e) => setConsent({ ...consent, consentMarketing: e.target.checked })}
                  style={{ width: '1rem', height: '1rem' }}
                />
                <span>
                  <strong>Consentement marketing</strong> — Recevoir des offres et actualités par email
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={consent.consentRgpd}
                  disabled
                  style={{ width: '1rem', height: '1rem' }}
                />
                <span>
                  <strong>Consentement RGPD</strong> — Traitement nécessaire au fonctionnement du service (obligatoire)
                </span>
              </label>
            </div>
            <button
              onClick={handleConsentUpdate}
              disabled={loading === 'consent'}
              style={buttonStyle('#7c3aed', loading === 'consent')}
            >
              {loading === 'consent' ? 'Mise à jour...' : 'Mettre à jour mes préférences'}
            </button>
          </RightCard>

          {/* Right to erasure */}
          <RightCard
            icon="🗑️"
            title="Droit à l'effacement (Article 17 RGPD)"
            description="Supprimez définitivement toutes vos données personnelles. Cette action est irréversible."
            danger
          >
            <button
              onClick={handleDelete}
              disabled={loading === 'delete'}
              style={buttonStyle('#dc2626', loading === 'delete')}
            >
              {loading === 'delete' ? 'Suppression...' : 'Supprimer mes données'}
            </button>
          </RightCard>

          {/* Contact DPO */}
          <RightCard
            icon="✉️"
            title="Contacter notre DPO"
            description="Pour toute demande relative à vos droits RGPD ou pour exercer le droit d'opposition (Article 21) et de rectification (Article 16)."
          >
            <a
              href="mailto:dpo@garantfacile.fr"
              style={{
                display: 'inline-block',
                background: '#6b7280',
                color: 'white',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              Contacter dpo@garantfacile.fr
            </a>
          </RightCard>
        </div>
      </div>
    </div>
  );
}

function RightCard({
  icon,
  title,
  description,
  children,
  danger,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        background: 'white',
        border: `1px solid ${danger ? '#fca5a5' : '#e5e7eb'}`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <div>
          <h3 style={{ fontWeight: '700', marginBottom: '0.25rem', color: danger ? '#b91c1c' : '#111827' }}>
            {title}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function buttonStyle(bg: string, disabled: boolean) {
  return {
    background: disabled ? '#9ca3af' : bg,
    color: 'white',
    border: 'none',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.375rem',
    fontWeight: '600' as const,
    fontSize: '0.9rem',
    cursor: disabled ? 'not-allowed' as const : 'pointer' as const,
  };
}
