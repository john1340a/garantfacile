'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Divider, 
  Spacer, 
  Chip,
  User as HeroUser,
  Spinner,
  cn
} from '@heroui/react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Navigation } from '@/components/Navigation';

interface GarantProfileProps {
  params: { id: string };
}

export default function GarantProfilePage({ params }: GarantProfileProps) {
  const [garant, setGarant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGarant() {
      try {
        const data = await apiClient.get(`/garants/${params.id}`);
        setGarant(data);
      } catch (err) {
        console.error('Fetch garant error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGarant();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="lg" color="primary" label="Chargement du profil..." />
      </div>
    );
  }

  if (!garant) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-2xl mx-auto px-6 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-default-300 mb-4">person_off</span>
          <h1 className="text-2xl font-bold mb-4">Garant non trouvé</h1>
          <p className="text-default-500 mb-8">Ce profil n&apos;existe pas ou n&apos;est plus disponible.</p>
          <Button as={Link} href="/dashboard" color="primary" variant="flat">
            Retour au tableau de bord
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <Button 
          as={Link} 
          href="/dashboard" 
          variant="light" 
          startContent={<span className="material-symbols-outlined">arrow_back</span>}
          className="mb-8"
        >
          Retour au dashboard
        </Button>

        <Card className="p-4" shadow="sm">
          <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary/20">
                {garant.user?.firstName?.[0] || '?'}
              </div>
              {garant.verified && (
                <div className="absolute -bottom-2 -right-2 bg-success text-white p-1.5 rounded-full border-4 border-white shadow-lg">
                  <span className="material-symbols-outlined text-base block">verified</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h1 className="text-3xl font-black mb-2">
                {garant.user?.firstName} {garant.user?.lastName?.[0]}.
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Chip 
                  color={garant.verified ? "success" : "warning"} 
                  variant="flat" 
                  size="sm"
                  startContent={<span className="material-symbols-outlined text-tiny">{garant.verified ? 'verified' : 'pending'}</span>}
                >
                  {garant.verified ? "Identité vérifiée" : "Vérification en cours"}
                </Chip>
                {garant.disponible && (
                  <Chip color="success" variant="bordered" size="sm" startContent={<span className="material-symbols-outlined text-tiny">event_available</span>}>
                    Disponible
                  </Chip>
                )}
              </div>
            </div>
          </CardHeader>

          <Divider className="my-4" />

          <CardBody className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <InfoCard 
                icon="work" 
                label="Profession" 
                value={garant.profession || 'Non renseignée'} 
              />
              <InfoCard 
                icon="payments" 
                label="Revenu annuel" 
                value={garant.revenuAnnuel ? `${garant.revenuAnnuel.toLocaleString('fr-FR')} €` : 'Non renseigné'} 
              />
              <InfoCard 
                icon="speed" 
                label="Score de fiabilité" 
                value={`${garant.score || 0}/100`}
                color={garant.score > 80 ? "text-success" : "text-primary"}
              />
              <InfoCard 
                icon="calendar_today" 
                label="Statut actuel" 
                value={garant.disponible ? 'Disponible immédiatement' : 'Non disponible'} 
              />
            </div>

            <Card className="bg-primary/5 border-primary/20" shadow="none">
              <CardBody className="flex flex-row gap-4 p-4 text-primary italic text-small leading-relaxed">
                <span className="material-symbols-outlined shrink-0">lock</span>
                <p>
                  Les informations de ce garant ont été scrupuleusement vérifiées par GarantFacile. 
                  Votre dossier sera traité de manière entièrement confidentielle et sécurisée.
                </p>
              </CardBody>
            </Card>

            <Spacer y={10} />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                as={Link} 
                href="/checkout" 
                color="primary" 
                size="lg" 
                variant="shadow"
                className="flex-1 font-bold"
                startContent={<span className="material-symbols-outlined">mail</span>}
              >
                Contacter ce garant
              </Button>
              <Button 
                as={Link} 
                href="/dashboard" 
                size="lg" 
                variant="flat"
                className="flex-1 font-semibold"
              >
                Voir d&apos;autres profils
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value, color = "text-default-900" }: { icon: string; label: string; value: string, color?: string }) {
  return (
    <div className="bg-default-50 rounded-2xl p-4 border border-default-100 flex items-center gap-4 hover:border-primary/30 transition-colors group">
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined block">{icon}</span>
      </div>
      <div>
        <p className="text-tiny text-default-400 font-bold uppercase tracking-wider">{label}</p>
        <p className={cn("text-lg font-black tracking-tight", color)}>{value}</p>
      </div>
    </div>
  );
}
