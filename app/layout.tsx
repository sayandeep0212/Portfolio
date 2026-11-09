import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sayandeep Pradhan | Full Stack Dev & UI Designer",
  description: "Computer Science Engineering student passionate about Full Stack Development, AI, and Cloud Technologies. Tech Lead at GameLiminals & Google Student Ambassador.",
  verification: {
    google: "cf4Xkiblsr-E7v7hHNbBGdRATGamFPyZ3hg22A8NUHI",
  },
  keywords: [
    "Sayandeep Pradhan",
    "Full Stack Developer",
    "UI Designer",
    "GameLiminals",
    "Google Student Ambassador",
    "Next.js Portfolio",
    "React Developer",
    "TypeScript",
  ],
  authors: [{ name: "Sayandeep Pradhan", url: "https://github.com/sayandeep0212" }],
  creator: "Sayandeep Pradhan",
  metadataBase: new URL("https://sayandeep.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sayandeep Pradhan | Full Stack Dev & UI Designer",
    description: "Personal portfolio showcasing development work, hackathon wins, certifications, and technical projects.",
    url: "https://sayandeep.dev",
    siteName: "Sayandeep Pradhan Portfolio",
    images: [
      {
        url: "/assets/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "Sayandeep Pradhan Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayandeep Pradhan | Full Stack Dev & UI Designer",
    description: "Computer Science Engineering student, Full Stack Developer & UI Designer.",
    images: ["/assets/hero-banner.webp"],
    creator: "@sayandeep0212",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "G-DSBL0RYG70";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sayandeep Pradhan",
    url: "https://sayandeep.dev",
    image: "https://sayandeep.dev/assets/avatar.webp",
    jobTitle: "Tech Lead & Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "GameLiminals",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Adamas University",
    },
    sameAs: [
      "https://github.com/sayandeep0212",
      "https://www.linkedin.com/in/sayandeep0212/",
      "https://x.com/sayandeep0212",
      "https://www.instagram.com/sayandeep0212/",
      "https://www.youtube.com/@SayandeepPradhan",
      "https://www.facebook.com/PradhanSayandeep",
      "https://medium.com/@sayandeep0212",
    ],
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Cybersecurity",
      "UI/UX Design",
    ],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="cf4Xkiblsr-E7v7hHNbBGdRATGamFPyZ3hg22A8NUHI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Kaushan+Script&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme') || localStorage.getItem('portfolio-theme');
                const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                // Stop any stale background service worker (e.g. Firebase Messaging / FCM)
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var i = 0; i < regs.length; i++) {
                      regs[i].unregister();
                    }
                  });
                }
              } catch (_) {}
            `,
          }}
        />

        {/* Google Analytics 4 (GA4) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager (GTM) */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
      </head>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        {/* Google Tag Manager (noscript fallback) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
