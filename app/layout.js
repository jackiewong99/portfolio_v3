import { Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const roboto_slab = Roboto_Slab({ subsets: ["latin"] });

export const metadata = {
  title: "Jackie Wong",
  description: "Portfolio of Jackie Wong's work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto_slab.className}>{children}</body>
    </html>
  );
}
