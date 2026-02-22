"use client";

import React from "react";
import {
  Link,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Divider
} from "@heroui/react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const plans = [
// ... (reste du code identique)
  {
    name: 'Mensuel',
    price: '29€',
    period: '/mois',
    features: [
      'Accès illimité aux garants vérifiés',
      'Filigranage de documents',
      'Support par email',
      'Tableau de bord locataire',
    ],
    planType: 'MENSUEL',
    highlighted: false,
  },
  {
    name: 'Annuel',
    price: '249€',
    period: '/an',
    features: [
      'Tout ce qui est inclus dans Mensuel',
      '2 mois offerts',
      'Support prioritaire',
      'Vérification identité garant',
      'Export de données sécurisé',
    ],
    planType: 'ANNUEL',
    highlighted: true,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      {/* Hero section */}
      <section className="bg-secondary-50 py-24 px-6 text-center border-b border-secondary-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
            La garantie locative réinventée avec GarantEasy
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            GarantEasy simplifie la mise en relation entre locataires et garants physiques. 
            Identités vérifiées, processus rapide et documents sécurisés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              href="/checkout"
              size="lg"
              color="primary"
              className="btn-shiny font-bold text-lg px-10 h-14 shadow-lg shadow-primary-200"
            >
              Commencer maintenant
            </Button>
            <Button
              as={Link}
              href="/garant/liste"
              size="lg"
              variant="bordered"
              color="primary"
              className="font-bold text-lg px-10 h-14"
            >
              Voir les garants
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 px-4 text-foreground">
            Pourquoi GarantEasy ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'handshake', title: 'Relation Directe', desc: 'Une plateforme humaine mettant en relation locataires et garants physiques.', color: 'text-success' },
              { icon: 'lock', title: 'Documents sécurisés', desc: 'Filigranage automatique via Filigrane Facile.', color: 'text-primary' },
              { icon: 'support_agent', title: 'Support Réactif', desc: 'Une équipe dédiée pour vous accompagner dans votre recherche.', color: 'text-warning' },
              { icon: 'bolt', title: 'Rapide & Simple', desc: 'Trouvez un garant en moins de 24h.', color: 'text-danger' },
            ].map((f) => (
              <Card key={f.title} className="p-4 border-none shadow-sm hover:shadow-md transition-shadow bg-content2 border border-secondary-100">
                <CardHeader className="flex flex-col items-center">
                  <div className={`text-5xl mb-4 ${f.color}`}>
                    <span className="material-symbols-outlined !text-5xl">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                </CardHeader>
                <CardBody className="text-gray-600">
                  <p>{f.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-secondary-100/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16"> Tarifs transparents </h2>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center md:items-stretch">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`w-full max-w-[340px] p-8 ${plan.highlighted ? 'bg-primary text-white scale-105 z-10 shadow-2xl ring-4 ring-primary-300' : 'bg-white text-slate-900 border-1 border-gray-200 shadow-xl'}`}
              >
                <CardHeader className="flex flex-col items-start gap-1 p-0">
                  {plan.highlighted && (
                    <Chip color="warning" variant="solid" className="mb-4 font-bold text-xs ring-2 ring-white/20">
                      MEILLEURE OFFRE
                    </Chip>
                  )}
                  <h3 className="text-2xl font-bold uppercase tracking-wider">{plan.name}</h3>
                  <div className="flex items-baseline mt-4">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={`ml-2 text-lg ${plan.highlighted ? 'opacity-70' : 'text-gray-500'}`}>{plan.period}</span>
                  </div>
                </CardHeader>
                <Divider className={`my-8 ${plan.highlighted ? 'bg-white/20' : 'bg-gray-100'}`} />
                <CardBody className="p-0 mb-10 text-left">
                  <ul className="space-y-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className={`material-symbols-outlined ${plan.highlighted ? 'text-white' : 'text-primary'}`}>check_circle</span>
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
                <CardFooter className="p-0">
                  <Button
                    as={Link}
                    href={`/checkout?plan=${plan.planType}`}
                    className={`btn-shiny w-full py-7 font-bold text-lg shadow-lg ${plan.highlighted ? 'bg-white text-primary hover:bg-gray-100 font-black' : 'bg-primary text-white shadow-primary-200'}`}
                    size="lg"
                  >
                    Choisir {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
