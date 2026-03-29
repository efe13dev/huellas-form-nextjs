"use client";

import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AnimalType } from "@/types";

import AnimalTable from "@/components/AnimalTable";
import Pagination from "@/components/Pagination";
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
    border: "border-gray-200",
    text: "text-gray-600",
    dot: "bg-gray-400",
    activeBg: "bg-gray-800",
  },
  adopted: {
    label: "Adoptados",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
    activeBg: "bg-green-600",
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
  const {
    animals,
    loading,
    error,
    handleDeleteAnimal,
    handleUpdateAnimal,
    handleToggleAdopted,
  } = useAnimals();

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error && animals.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
        <p className="text-lg font-medium text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Listado de Animales
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona los animales disponibles para adopcion
          </p>
        </div>

        <div className="flex gap-1.5">
          {(Object.keys(FILTER_CONFIG) as FilterStatus[]).map((key) => {
            const cfg = FILTER_CONFIG[key];
            const isActive = filter === key;

            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? `${cfg.activeBg} border-transparent text-white shadow-sm`
                    : `${cfg.bg} ${cfg.border} ${cfg.text} hover:opacity-80`
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : cfg.dot}`}
                />
                {cfg.label}: {counts[key]}
              </button>
            );
          })}
        </div>
      </div>

      <AnimalTable
        animals={paginatedAnimals}
        onDelete={handleDeleteAnimal}
        onUpdate={(animalData: AnimalType) =>
          handleUpdateAnimal(animalData.id, animalData)
        }
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
  );
}

export default ListPage;
