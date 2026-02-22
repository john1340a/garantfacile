import type { Metadata } from 'next';
import Script from 'next/script';
import { HeroUIProvider } from "@heroui/react";
import './globals.css';

export const metadata: Metadata = {
  title: 'GarantEasy - Trouvez votre garant en toute simplicité',
  description:
    'La garantie locative simplifiée. GarantEasy met en relation locataires et garants physiques vérifiés.',
  keywords: ['garant', 'locataire', 'location', 'caution', 'garantie loyer', 'garanteasy'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const axeptioClientId = process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID;

  return (
    <html lang="fr" className='light'>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
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
                  cookiesVersion: "garanteasy-fr",
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
        <HeroUIProvider>
          <main>{children}</main>
        </HeroUIProvider>
      </body>
    </html>
  );
}
