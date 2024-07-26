import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./globals.css";
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infracciones App",
  description: "Aplicación de registro de infracciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="es">
        <body className={inter.className}>
          <Navbar/>
          <main className="min-h-screen">
          {children}
          </main>
          <Footer/>
        </body>
      </html>
    </AuthProvider>
  );
}
