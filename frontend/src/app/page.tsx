"use client";

import React from "react";
import {
  Link,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

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

      {/* Comment ça marche */}
      <section className="py-24 px-6 bg-secondary-50 border-y border-secondary-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-foreground">
            En 3 étapes simples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: 'person_search', title: 'Choisissez un garant', desc: 'Parcourez notre catalogue de garants physiques vérifiés et sélectionnez celui qui correspond à votre dossier.' },
              { step: '02', icon: 'upload_file', title: 'Envoyez vos documents', desc: 'Déposez vos justificatifs en toute sécurité. Ils seront filigranés automatiquement pour votre protection.' },
              { step: '03', icon: 'task_alt', title: 'Obtenez votre garantie', desc: 'Votre garant valide le dossier et vous recevez votre attestation pour rassurer votre propriétaire.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <span className="text-7xl font-black text-secondary-200 select-none leading-none">{s.step}</span>
                  <span className="material-symbols-outlined !text-3xl text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{s.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6 bg-foreground text-center">
        <div className="max-w-2xl mx-auto">
          <span className="material-symbols-outlined !text-5xl text-secondary-300 mb-6 block">home_work</span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-100 mb-6">
            Prêt à sécuriser votre location ?
          </h2>
          <p className="text-secondary-300 text-lg mb-10 leading-relaxed">
            Rejoignez les locataires qui font confiance à GarantEasy pour trouver un garant en 24h.
          </p>
          <Button
            as={Link}
            href="/checkout"
            size="lg"
            className="btn-shiny bg-secondary-200 text-foreground font-bold text-lg px-12 h-14"
          >
            Trouver mon garant
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

