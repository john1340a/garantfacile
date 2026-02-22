import Link from 'next/link';

const plans = [
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
      'Export de données RGPD',
    ],
    planType: 'ANNUEL',
    highlighted: true,
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
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
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🏠 GarantFacile</div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/garant/liste" style={{ color: 'white' }}>
            Nos Garants
          </Link>
          <Link href="/dashboard" style={{ color: 'white' }}>
            Dashboard
          </Link>
          <Link
            href="/checkout"
            style={{
              background: 'white',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
            }}
          >
            Commencer
          </Link>
        </nav>
      </header>

      {/* Hero section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          textAlign: 'center',
          padding: '5rem 2rem',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          Trouvez votre garant en toute confiance
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          GarantFacile met en relation locataires et garants vérifiés. Documents filigranés, identités
          vérifiées, conforme RGPD.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            href="/checkout"
            style={{
              background: 'white',
              color: '#1e40af',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '700',
              fontSize: '1.1rem',
            }}
          >
            Commencer maintenant
          </Link>
          <Link
            href="/garant/liste"
            style={{
              border: '2px solid white',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
            }}
          >
            Voir les garants
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 2rem', background: 'white' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', marginBottom: '3rem' }}>
          Pourquoi GarantFacile ?
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {[
            { icon: '✅', title: 'Garants vérifiés', desc: 'Identité et solvabilité vérifiées via GarantFacile API.' },
            { icon: '🔒', title: 'Documents sécurisés', desc: 'Filigranage automatique via Filigrane Facile API.' },
            { icon: '🇪🇺', title: 'Conforme RGPD', desc: 'Vos données sont chiffrées AES-256 et exportables.' },
            { icon: '⚡', title: 'Rapide & Simple', desc: 'Trouvez un garant en moins de 24h.' },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#6b7280' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '4rem 2rem', background: '#f9fafb' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', marginBottom: '3rem' }}>
          Tarifs transparents
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlighted ? '#1e40af' : 'white',
                color: plan.highlighted ? 'white' : '#111827',
                border: plan.highlighted ? 'none' : '1px solid #e5e7eb',
                borderRadius: '1rem',
                padding: '2rem',
                width: '300px',
                boxShadow: plan.highlighted ? '0 20px 40px rgba(30,64,175,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                transform: plan.highlighted ? 'scale(1.05)' : 'none',
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    background: '#fbbf24',
                    color: '#111827',
                    borderRadius: '9999px',
                    padding: '0.25rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    display: 'inline-block',
                  }}
                >
                  MEILLEURE OFFRE
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{plan.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', margin: '1rem 0 0.25rem' }}>
                {plan.price}
              </div>
              <div style={{ opacity: 0.7, marginBottom: '1.5rem' }}>{plan.period}</div>
              <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/checkout?plan=${plan.planType}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: plan.highlighted ? 'white' : '#1e40af',
                  color: plan.highlighted ? '#1e40af' : 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                }}
              >
                Choisir {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#111827',
          color: '#9ca3af',
          textAlign: 'center',
          padding: '2rem',
          marginTop: '2rem',
        }}
      >
        <p>© 2024 GarantFacile. Tous droits réservés.</p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link href="/rgpd" style={{ color: '#9ca3af' }}>
            Politique de confidentialité &amp; RGPD
          </Link>
        </p>
      </footer>
    </div>
  );
}
