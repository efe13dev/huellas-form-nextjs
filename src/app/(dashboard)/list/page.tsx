"use client";

import { AlertCircle, CheckCircle2, FileText, Loader2, PlusCircle, Tag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AnimalType } from "@/types";

import AnimalTable from "@/components/AnimalTable";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useAnimals } from "@/hooks/useAnimals";
import { usePagination } from "@/hooks/usePagination";

type FilterStatus = "all" | "adopted" | "available";

const FILTER_CONFIG: Record<
  FilterStatus,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    dot: string;
    activeBg: string;
  }
> = {
  all: {
    label: "Total",
    bg: "bg-white",
    border: "border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
    activeBg: "bg-slate-950",
  },
  adopted: {
    label: "Adoptados",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    activeBg: "bg-emerald-600",
  },
  available: {
    label: "Disponibles",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    activeBg: "bg-amber-500",
  },
};

function ListPage() {
  const { animals, loading, error, handleDeleteAnimal, handleUpdateAnimal, handleToggleAdopted } =
    useAnimals();

  const [filter, setFilter] = useState<FilterStatus>("all");

  const filteredAnimals = useMemo(() => {
    if (filter === "adopted") return animals.filter((a) => a.adopted);
    if (filter === "available") return animals.filter((a) => !a.adopted);

    return animals;
  }, [animals, filter]);

  const adoptedCount = animals.filter((a) => a.adopted).length;
  const availableCount = animals.length - adoptedCount;

  const counts: Record<FilterStatus, number> = {
    all: animals.length,
    adopted: adoptedCount,
    available: availableCount,
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedAnimals,
    goToPage,
    itemsPerPage,
    totalItems,
  } = usePagination({ data: filteredAnimals, itemsPerPage: 10 });

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-700" />
            <p className="mt-4 text-lg font-semibold text-slate-900">Cargando animales...</p>
            <p className="mt-1 text-sm text-slate-500">
              Estamos preparando el panel de adopciones.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && animals.length === 0) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-950">No se pudo cargar la lista</h1>
            <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-100">
                  <Tag className="h-4 w-4" />
                  Panel de adopciones
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lista de animales</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Gestiona animales disponibles, registros adoptados y actualizaciones de ficha
                  desde un panel visual.
                </p>
              </div>
              <Button
                asChild
                className="h-11 rounded-xl bg-white px-5 font-semibold text-slate-950 shadow-sm hover:bg-emerald-50"
              >
                <Link href="/">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo animal
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total registrados</p>
              <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{animals.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Disponibles</p>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-700">
                <Tag className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{availableCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Adoptados</p>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{adoptedCount}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Animales registrados</h2>
              <p className="mt-1 text-sm text-slate-500">
                Filtra por estado y revisa cada ficha rápidamente.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(FILTER_CONFIG) as FilterStatus[]).map((key) => {
                const cfg = FILTER_CONFIG[key];
                const isActive = filter === key;

                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? `${cfg.activeBg} border-transparent text-white shadow-sm`
                        : `${cfg.bg} ${cfg.border} ${cfg.text} hover:bg-slate-50`
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-white" : cfg.dot}`} />
                    {cfg.label}: {counts[key]}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimalTable
            animals={paginatedAnimals}
            onDelete={handleDeleteAnimal}
            onUpdate={(animalData: AnimalType) => handleUpdateAnimal(animalData.id, animalData)}
            onToggleAdopted={handleToggleAdopted}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </section>
      </div>
    </main>
  );
}

export default ListPage;
