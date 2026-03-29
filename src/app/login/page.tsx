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
        setError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.");
      }
    });
  };

  if (status === "loading" || isSuccess || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_45%)]" />

      <div className="relative z-10 mx-4 w-full max-w-md duration-700 animate-in fade-in zoom-in-95">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center gap-4">
            <Image src="/logo-huellas-opt.png" alt="Logo Huellas" width={72} height={72} priority />
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">Huellas</h1>
              <p className="mt-1 text-sm text-white/60">Web de gestión interna</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-white/80">
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
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-white/25 focus-visible:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/80">
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
                  className="border-white/10 bg-white/5 pr-10 text-white placeholder:text-white/30 focus-visible:border-white/25 focus-visible:ring-white/20"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 duration-300 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-white/90 font-semibold text-gray-900 transition-all hover:bg-white hover:shadow-lg hover:shadow-white/10 disabled:opacity-60"
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

        <p className="mt-6 text-center text-xs text-white/30">Protectora de animales Huellas</p>
      </div>
    </div>
  );
}
