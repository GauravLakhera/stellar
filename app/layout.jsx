import "./globals.css";
import { TransitionProvider } from "../components/TransitionProvider";
import WhatsAppFloat from "../components/WhatsAppFloat"

export const metadata = {
  title: "Stellar Design Lab - Innovative Architecture & Design",
  description:
    "STELLARDESIGNLAB offers innovative architectural design, interior design, and master planning services in Dehradun and beyond. Crafting visionary spaces for living and working.",
  keywords:
    "architecture, architectural design, interior design, master planning, building design, modern architecture, sustainable architecture, Dehradun, STELLARDESIGNLAB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative bg-blue-100/70">
        <TransitionProvider>
          <main className="h-full w-full bg-blue-100/70">{children}</main>
              <WhatsAppFloat />
        </TransitionProvider>
      </body>
    </html>
  );
}