import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

export const metadata = {
  title: "WorkNow - Plataforma de Locação de Salas Comerciais",
  description:
    "Plataforma moderna para locação de salas comerciais. Conecte proprietários e locatários de forma simples e eficiente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
