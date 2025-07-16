import "./globals.css";

export const metadata = {
  title: "Stellar Designe Lab - Innovative Architecture & Design",
  description:
    "STELLARDESIGNLAB offers innovative architectural design, interior design, and master planning services in Dehradun and beyond. Crafting visionary spaces for living and working.",
  keywords:
    "architecture, architectural design, interior design, master planning, building design, modern architecture, sustainable architecture, Dehradun, STELLARDESIGNLAB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative bg-[#b4aea7]">
        {/* <MouseTracker /> */}

        <main className="h-full w-full bg-[#b4aea7]">{children}</main>
      </body>
    </html>
  );
}
