'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Divider, 
  Button, 
  Chip, 
  Spacer,
  Link as HeroLink,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User as HeroUser,
  Spinner
} from '@heroui/react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';

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

  const getStatusColor = (status: string): "success" | "warning" | "default" | "danger" | "primary" | "secondary" => {
    switch (status) {
      case 'DONE':
      case 'ACTIF':
        return 'success';
      case 'PROCESSING':
      case 'EN_ATTENTE':
        return 'warning';
      case 'ERROR':
      case 'ANNULE':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="lg" color="primary" label="Chargement de votre dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">dashboard</span>
            Tableau de bord
          </h1>
          <p className="text-default-500 mt-2">
            {user ? `Bienvenue, ${user.firstName}. Retrouvez ici vos garants et documents.` : 'Gérez votre location en toute simplicité.'}
          </p>
        </header>

        {/* Subscription status */}
        <section className="mb-12">
          {abonnement ? (
            <Card className="bg-primary/5 border-primary/20" shadow="sm">
              <CardBody className="flex flex-row flex-wrap items-center justify-between gap-6 p-8">
                <div className="flex items-center gap-6">
                  <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Abonnement {abonnement.plan}</h3>
                    <p className="text-default-500">
                      {abonnement.currentPeriodEnd
                        ? `Renouvellement le ${new Date(abonnement.currentPeriodEnd).toLocaleDateString('fr-FR')}`
                        : 'Plan actif sans date de fin'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Chip color={getStatusColor(abonnement.status)} variant="flat" className="capitalize">
                    {abonnement.status.toLowerCase()}
                  </Chip>
                  <Button as={Link} href="/checkout" color="primary" variant="shadow">
                    Gérer mon offre
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="bg-warning/5 border-warning/20" shadow="sm">
              <CardBody className="flex flex-row flex-wrap items-center justify-between gap-6 p-8">
                <div className="flex items-center gap-6">
                  <div className="bg-warning text-white p-4 rounded-2xl shadow-lg shadow-warning/30">
                    <span className="material-symbols-outlined text-3xl">warning</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Aucun abonnement actif</h3>
                    <p className="text-default-500">Souscrivez pour accéder à tous nos garants vérifiés et sécuriser votre dossier.</p>
                  </div>
                </div>
                <Button as={Link} href="/checkout" color="warning" variant="shadow" className="text-white">
                  S'abonner maintenant
                </Button>
              </CardBody>
            </Card>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Guarantors list */}
          <Card shadow="sm">
            <CardHeader className="flex flex-col items-start gap-1 p-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">group</span>
                <h2 className="text-xl font-bold">Garants disponibles</h2>
              </div>
              <p className="text-small text-default-500">Profils vérifiés correspondant à votre recherche</p>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {garants.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-default-400">
                  <span className="material-symbols-outlined text-5xl mb-4">person_search</span>
                  <p>Aucun garant disponible actuellement.</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {garants.slice(0, 5).map((g) => (
                    <Card 
                      key={g.id} 
                      isPressable 
                      as={Link} 
                      href={`/garant/${g.id}`}
                      className="border-none bg-default-50 hover:bg-default-100 transition-colors w-full"
                      shadow="none"
                    >
                      <CardBody className="flex flex-row items-center justify-between p-4">
                        <HeroUser   
                          name={`${g.user.firstName} ${g.user.lastName[0]}.`}
                          description={g.profession}
                          avatarProps={{
                            src: `https://i.pravatar.cc/150?u=${g.id}`,
                            color: "primary",
                            isBordered: true
                          }}
                        />
                        <div className="flex flex-col items-end gap-2">
                          <Chip 
                            color="secondary" 
                            size="sm" 
                            variant="flat"
                            startContent={<span className="material-symbols-outlined text-tiny">star</span>}
                          >
                            Score: {g.score}
                          </Chip>
                          {g.disponible && (
                            <span className="text-tiny text-success flex items-center gap-1 font-bold">
                              <span className="material-symbols-outlined text-tiny">check_circle</span>
                              Disponible
                            </span>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                  <div className="p-2 flex justify-center">
                    <Button variant="light" color="primary" endContent={<span className="material-symbols-outlined">arrow_forward</span>}>
                      Voir tous les garants
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Documents */}
          <Card shadow="sm">
            <CardHeader className="flex flex-col items-start gap-1 p-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                <h2 className="text-xl font-bold">Mes documents</h2>
              </div>
              <p className="text-small text-default-500">Gérez vos justificatifs téléchargés</p>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-default-400">
                  <span className="material-symbols-outlined text-5xl mb-4">upload_file</span>
                  <p>Aucun document téléversé.</p>
                  <Button color="primary" variant="flat" className="mt-4" startContent={<span className="material-symbols-outlined">add</span>}>
                    Ajouter un document
                  </Button>
                </div>
              ) : (
                <Table aria-label="Table des documents" removeWrapper className="p-2">
                  <TableHeader>
                    <TableColumn>DOCUMENT</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>STATUT</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-small font-bold">{doc.filename}</span>
                            <span className="text-tiny text-default-400">{doc.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-tiny">
                          {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={getStatusColor(doc.status)} 
                            size="sm" 
                            variant="flat"
                            className="capitalize"
                          >
                            {doc.status.toLowerCase()}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        </div>
      </main>
      
      <Spacer y={12} />
      <footer className="py-12 px-6 border-t border-divider text-center text-default-400 bg-default-50">
        <p className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">security</span>
          Interface sécurisée GarantFacile © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
