"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
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
    <header className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 pt-6 sm:pt-10 min-h-[170px]">
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <motion.img
          src="/logo-huellas-opt.png"
          alt="logo de fido"
          className="w-16 h-16 mr-4"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)", rotate: 0 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: -10 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        />
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-semibold font-serif text-gray-800"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.13 }}
        >
          Huellas
        </motion.h1>
      </div>
      <h2 className=" text-center ml-8 text-gray-500 text-lg sm:text-xl md:text-2xl">
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
            className="inline-block mr-2"
          >
            {palabra}
          </motion.span>
        ))}
      </h2>
      <nav className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 min-h-[44px] mt-4 mb-4">
          {status === "loading" ? (
            <div className="w-[230px] h-[44px] sm:w-[350px]"></div>
          ) : session ? (
            <>
              <Link href={"/"}>
                <Button
                  variant={"ghost"}
                  className={`w-full sm:w-auto text-sm sm:text-base transition-colors duration-300 ${
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
                  className={`w-full sm:w-auto text-sm sm:text-base transition-colors duration-300 ${
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
                  className={`w-full sm:w-auto text-sm sm:text-base transition-colors duration-300 ${
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
                  className={`w-full sm:w-auto text-sm sm:text-base transition-colors duration-300 ${
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
            <div className="w-[230px] h-[44px] sm:w-[350px]"></div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {status !== "loading" && session && <LogoutButton />}
        </div>
      </nav>
    </header>
  );
};
