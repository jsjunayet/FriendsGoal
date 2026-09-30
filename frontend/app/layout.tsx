import type { Metadata, Viewport } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/navigation/ConditionalNavbar";
import { Footer } from "@/components/footer/Footer";
import { SITE_CONFIG } from "@/constants/site";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-caslon",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Friends Goal",
    "interest-free savings",
    "community savings",
    "Bangladesh",
    "financial community",
    "Dhaka",
  ],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1FDE64",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${inter.variable} ${libreCaslon.variable} overflow-x-hidden`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white antialiased overflow-x-hidden">
        <AuthProvider>
          <QueryProvider>
            <LanguageProvider>
              <ConditionalNavbar />
              <main className="flex-1 w-full overflow-x-hidden">{children}</main>
              <Footer />
              <Toaster position="top-right" richColors />
            </LanguageProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
