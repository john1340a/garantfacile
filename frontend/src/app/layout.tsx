import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'GarantFacile - Trouvez votre garant en toute confiance',
  description:
    'Plateforme SaaS mettant en relation locataires et propriétaires avec un service de garant premium vérifié.',
  keywords: ['garant', 'locataire', 'location', 'caution', 'garantie loyer'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const axeptioClientId = process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID;

  return (
    <html lang="fr">
      <body>
        {/* Axeptio GDPR consent banner */}
        {axeptioClientId && (
          <Script
            id="axeptio-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.axeptioSettings = {
                  clientId: "${axeptioClientId}",
                  cookiesVersion: "garantfacile-fr",
                  googleConsentMode: {
                    default: {
                      analytics_storage: "denied",
                      ad_storage: "denied",
                      ad_user_data: "denied",
                      ad_personalization: "denied",
                    }
                  }
                };
                (function(d, s) {
                  var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
                  e.async = true;
                  e.src = "//static.axept.io/sdk.js";
                  t.parentNode.insertBefore(e, t);
                })(document, "script");
              `,
            }}
          />
        )}
        <main>{children}</main>
      </body>
    </html>
  );
}
