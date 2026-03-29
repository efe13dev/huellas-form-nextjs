"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import LogoutButton from "./LogoutButton";

export const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === "/" || pathname === "/add-animal";
    }

    return pathname === path;
  };

  return (
    <LazyMotion features={domAnimation}>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <m.img
              src="/logo-huellas-opt.png"
              alt="Logo Huellas"
              className="h-9 w-9"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="text-lg font-bold text-gray-800">Huellas</span>
          </div>

          {status === "loading" ? (
            <div className="h-8 w-64" />
          ) : session ? (
            <nav className="flex items-center gap-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`text-sm ${isActive("/") ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Añadir animal
                </Button>
              </Link>
              <Link href="./list">
                <Button
                  variant="ghost"
                  className={`text-sm ${isActive("/list") ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Animales
                </Button>
              </Link>
              <Link href="./news">
                <Button
                  variant="ghost"
                  className={`text-sm ${isActive("/news") ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Añadir noticia
                </Button>
              </Link>
              <Link href="./news-list">
                <Button
                  variant="ghost"
                  className={`text-sm ${isActive("/news-list") ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Noticias
                </Button>
              </Link>
              <div className="ml-2 border-l border-gray-200 pl-2">
                <LogoutButton />
              </div>
            </nav>
          ) : (
            <div className="h-8 w-64" />
          )}
        </div>
      </header>
    </LazyMotion>
  );
};
