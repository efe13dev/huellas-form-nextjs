"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import LogoutButton from "./LogoutButton";

export const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const links = [
    { href: "/list", label: "Animales" },
    { href: "/news-list", label: "Noticias" },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/list") return pathname === "/list" || pathname === "/";
    if (path === "/news-list") return pathname === "/news-list" || pathname === "/news";

    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/list" className="flex items-center gap-2.5">
          <img
            src="/logo-huellas-opt.png"
            alt="Logo Huellas"
            className="h-7 w-7 animate-[fade-in_0.4s_ease-out]"
          />
          <span className="text-sm font-semibold text-foreground">Huellas</span>
        </Link>

        {status === "loading" ? (
          <div className="h-8 w-48" />
        ) : session ? (
          <nav className="flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-3 border-l border-border pl-3">
              <LogoutButton />
            </div>
          </nav>
        ) : (
          <div className="h-8 w-48" />
        )}
      </div>
    </header>
  );
};
