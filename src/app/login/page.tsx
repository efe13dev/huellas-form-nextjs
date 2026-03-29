"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { status } = useSession();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/list");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          name,
          password,
        });

        if (result?.error) {
          setError("Nombre de usuario o contraseña inválidos");
        } else {
          setIsSuccess(true);
          router.push("/list");
        }
      } catch {
        setError(
          "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.",
        );
      }
    });
  };

  if (status === "loading" || isSuccess || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50">
      <div className="relative z-10 mx-4 w-full max-w-md duration-700 animate-in fade-in zoom-in-95">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md sm:p-10">
          <div className="mb-8 flex flex-col items-center gap-4">
            <Image
              src="/logo-huellas-opt.png"
              alt="Logo Huellas"
              width={72}
              height={72}
              priority
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Huellas
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Web de gestión interna
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-600"
              >
                Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Nombre de usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-600"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 bg-gray-50 pr-10 text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 duration-300 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-gray-900 font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Protectora de animales Huellas
        </p>
      </div>
    </div>
  );
}
