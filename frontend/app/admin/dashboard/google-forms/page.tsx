import type { Metadata } from "next";
import { GoogleFormManagementView } from "@/components/forms/GoogleFormManagementView";

export const metadata: Metadata = {
  title: "Google Forms Management | Friends Goal Admin",
  description: "Embed and manage Google Forms for members.",
};

export default function AdminGoogleFormsPage() {
  return <GoogleFormManagementView />;
}
