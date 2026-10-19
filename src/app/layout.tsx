"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Koleksi Buku", icon: "📚" },
  { href: "/peminjaman", label: "Peminjaman", icon: "⇄" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="id">
      <body className="bg-[#F8F9FA] text-gray-900">
        <title>Ruang Baca</title>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center gap-3 py-4">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-lg">
                📖
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight text-gray-900">
                  Ruang Baca
                </h1>
                <p className="text-[10px] tracking-wide text-gray-500 uppercase">
                  Perpustakaan Mini
                </p>
              </div>
            </div>

            <nav className="flex gap-6">
              {tabs.map((tab) => {
                const aktif =
                  tab.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 pb-3 text-sm border-b-2 transition-colors ${
                      aktif
                        ? "border-[#2D6A4F] text-[#2D6A4F] font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}