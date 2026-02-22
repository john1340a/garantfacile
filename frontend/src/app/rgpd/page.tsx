'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Divider, 
  Spacer, 
  Checkbox,
  Link as HeroLink,
  Spinner,
  cn
} from '@heroui/react';
import Link from 'next/link';
import { getAuthToken } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';

export default function RgpdPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
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
    setMessage(null);
    try {
      const data = await apiFetch('/rgpd/export');
      setExportData(data);
      setMessage({ type: 'success', text: 'Export généré avec succès. Vous pouvez maintenant le télécharger.' });
    } catch (e: any) {
      setMessage({ type: 'danger', text: e.message });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) return;
    setLoading('delete');
    setMessage(null);
    try {
      const data = await apiFetch('/rgpd/delete', 'DELETE');
      setMessage({ type: 'success', text: data.message });
    } catch (e: any) {
      setMessage({ type: 'danger', text: e.message });
    } finally {
      setLoading(null);
    }
  };

  const handleConsentUpdate = async () => {
    setLoading('consent');
    setMessage(null);
    try {
      await apiFetch('/rgpd/consent', 'PUT', consent);
      setMessage({ type: 'success', text: 'Vos préférences de consentement ont été mises à jour.' });
    } catch (e: any) {
      setMessage({ type: 'danger', text: e.message });
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
    <div className="min-h-screen bg-background pb-20">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-4">Mes droits RGPD</h1>
          <p className="text-xl text-default-500 max-w-2xl leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de
            droits essentiels sur vos données personnelles (Accès, Rectification, Effacement, Opposition).
          </p>
        </header>

        {message && (
          <Card className={cn("mb-8 border-none shadow-lg", message.type === 'success' ? "bg-success/10" : "bg-danger/10")}>
            <CardBody className="flex flex-row items-center gap-4 py-4 px-6 font-medium">
              <span className={cn("material-symbols-outlined", message.type === 'success' ? "text-success" : "text-danger")}>
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className={cn(message.type === 'success' ? "text-success-700" : "text-danger-700")}>
                {message.text}
              </p>
            </CardBody>
          </Card>
        )}

        <div className="grid gap-8">
          {/* Right of access */}
          <RightCard
            icon="folder_zip"
            title="Droit d'accès (Article 15)"
            description="Téléchargez l'intégralité de vos données personnelles stockées sur nos serveurs en un clic."
          >
            <div className="flex flex-wrap gap-4 mt-6">
              <Button
                onPress={handleExport}
                isLoading={loading === 'export'}
                color="primary"
                variant="shadow"
                className="font-bold"
                startContent={!loading && <span className="material-symbols-outlined text-small">download</span>}
              >
                Générer mon export
              </Button>
              {exportData && (
                <Button 
                  onPress={downloadExport} 
                  color="success" 
                  variant="flat"
                  className="font-bold"
                  startContent={<span className="material-symbols-outlined text-small">file_download</span>}
                >
                  Télécharger le fichier JSON
                </Button>
              )}
            </div>
          </RightCard>

          {/* Consent management */}
          <RightCard
            icon="settings_suggest"
            title="Gestion du consentement (Article 7)"
            description="Contrôlez la manière dont nous traitons vos informations."
          >
            <div className="space-y-4 mt-6">
              <Checkbox
                isSelected={consent.consentMarketing}
                onValueChange={(isSelected) => setConsent({ ...consent, consentMarketing: isSelected })}
                classNames={{ label: "text-default-700 font-medium" }}
              >
                Marketing — Recevoir nos offres et actualités par email
              </Checkbox>
              <Checkbox
                isSelected={consent.consentRgpd}
                isDisabled
                classNames={{ label: "text-default-400 font-medium italic" }}
              >
                Fonctionnement — Traitement nécessaire au service (Obligatoire)
              </Checkbox>
            </div>
            <Spacer y={6} />
            <Button
              onPress={handleConsentUpdate}
              isLoading={loading === 'consent'}
              color="secondary"
              variant="flat"
              className="font-bold"
              startContent={!loading && <span className="material-symbols-outlined text-small">save</span>}
            >
              Enregistrer mes préférences
            </Button>
          </RightCard>

          {/* Right to erasure */}
          <RightCard
            icon="delete_forever"
            title="Droit à l'effacement (Article 17)"
            description="Supprimez définitivement votre compte et toutes ses données. Attention, cette action est irréversible."
            danger
          >
            <div className="mt-6">
              <Button
                onPress={handleDelete}
                isLoading={loading === 'delete'}
                color="danger"
                variant="light"
                className="font-bold border-1 border-danger"
                startContent={!loading && <span className="material-symbols-outlined text-small">warning</span>}
              >
                Supprimer mes données définitivement
              </Button>
            </div>
          </RightCard>

          {/* Contact DPO */}
          <Card className="bg-default-50 border-none" shadow="none">
            <CardBody className="p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-default-200 flex items-center justify-center text-default-600">
                <span className="material-symbols-outlined text-3xl">contact_mail</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold mb-1">Besoin d&apos;assistance ?</h3>
                <p className="text-default-500 text-small mb-4 sm:mb-0">
                  Contactez notre Délégué à la Protection des Données pour toute question sur vos droits ou pour exercer votre droit de rectification.
                </p>
              </div>
              <Button 
                as="a" 
                href="mailto:dpo@garantfacile.fr"
                variant="shadow"
                color="default"
                className="font-bold"
              >
                Contacter le DPO
              </Button>
            </CardBody>
          </Card>
        </div>
      </main>
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
    <Card 
      className={cn(
        "border-1", 
        danger ? "border-danger/10 bg-danger/5" : "border-default-100 shadow-sm"
      )}
    >
      <CardBody className="p-8">
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-2xl",
            danger ? "bg-danger text-white" : "bg-primary-100 text-primary"
          )}>
            <span className="material-symbols-outlined block text-2xl">{icon}</span>
          </div>
          <div className="flex-1">
            <h3 className={cn("text-xl font-black mb-1", danger ? "text-danger" : "text-default-900")}>
              {title}
            </h3>
            <p className="text-default-500 font-medium text-small leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="pl-0 sm:pl-16">
          {children}
        </div>
      </CardBody>
    </Card>
  );
}
