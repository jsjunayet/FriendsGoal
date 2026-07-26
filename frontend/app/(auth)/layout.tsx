import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Friends Goal",
  description: "Securely access your Friends Goal member account.",
};

/**
 * Dedicated layout for auth routes.
 * Renders children WITHOUT the global Navbar and Footer.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
