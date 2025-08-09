"use client";

import { motion } from "framer-motion";
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
    <header className="mx-4 min-h-[170px] pt-6 sm:mx-8 sm:pt-10 md:mx-16 lg:mx-32">
      <div className="mb-4 flex items-center justify-center sm:mb-6">
        <motion.img
          src="/logo-huellas-opt.png"
          alt="logo de fido"
          className="mr-4 h-16 w-16"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)", rotate: 0 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: -10 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        />
        <motion.h1
          className="font-serif text-4xl font-semibold text-gray-800 sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.13 }}
        >
          Huellas
        </motion.h1>
      </div>
      <h2 className="ml-8 text-center text-lg text-gray-500 sm:text-xl md:text-2xl">
        {["Web", "de", "gestion", "interna"].map((palabra, i) => (
          <motion.span
            key={palabra + i}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.25 + i * 0.15,
            }}
            className="mr-2 inline-block"
          >
            {palabra}
          </motion.span>
        ))}
      </h2>
      <nav className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end sm:gap-6">
        <div className="mb-4 mt-4 flex min-h-[44px] flex-col gap-3 sm:flex-row sm:gap-6">
          {status === "loading" ? (
            <div className="h-[44px] w-[230px] sm:w-[350px]"></div>
          ) : session ? (
            <>
              <Link href={"/"}>
                <Button
                  variant={"ghost"}
                  className={`w-full text-sm transition-colors duration-300 sm:w-auto sm:text-base ${
                    isActive("/")
                      ? "bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
                      : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Añadir animal
                </Button>
              </Link>
              <Link href={"./list"}>
                <Button
                  variant={"ghost"}
                  className={`w-full text-sm transition-colors duration-300 sm:w-auto sm:text-base ${
                    isActive("/list")
                      ? "bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
                      : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Lista de animales
                </Button>
              </Link>
              <Link href={"./news"}>
                <Button
                  variant={"ghost"}
                  className={`w-full text-sm transition-colors duration-300 sm:w-auto sm:text-base ${
                    isActive("/news")
                      ? "bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
                      : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Añadir noticia
                </Button>
              </Link>
              <Link href={"./news-list"}>
                <Button
                  variant={"ghost"}
                  className={`w-full text-sm transition-colors duration-300 sm:w-auto sm:text-base ${
                    isActive("/news-list")
                      ? "bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
                      : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Lista de noticias
                </Button>
              </Link>
            </>
          ) : (
            <div className="h-[44px] w-[230px] sm:w-[350px]"></div>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          {status !== "loading" && session && <LogoutButton />}
        </div>
      </nav>
    </header>
  );
};
