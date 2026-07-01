"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AnimalType } from "@/types";

import AnimalTable from "@/components/AnimalTable";
import Pagination from "@/components/Pagination";
import { useAnimals } from "@/hooks/useAnimals";
import { usePagination } from "@/hooks/usePagination";

type FilterStatus = "all" | "adopted" | "available";

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
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error && animals.length === 0) {
    return (
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      </main>
    );
  }

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "available", label: "Disponibles" },
    { key: "adopted", label: "Adoptados" },
  ];

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Animales</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {animals.length} registrados &middot; {availableCount} disponibles &middot;{" "}
              {adoptedCount} adoptados
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo
          </Link>
        </div>

        <div className="mb-4 flex gap-1">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label} ({counts[key]})
            </button>
          ))}
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
      </div>
    </main>
  );
}

export default ListPage;
