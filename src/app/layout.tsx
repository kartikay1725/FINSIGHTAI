import "@/app/globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinSight AI",
  description: "AI-powered financial fraud detection and credit analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}

        <Footer />
      </body>
      
    </html>
  );
}
