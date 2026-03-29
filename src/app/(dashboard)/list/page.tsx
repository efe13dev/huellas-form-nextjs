"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { AnimalType } from "@/types";

import AnimalTable from "@/components/AnimalTable";
import Pagination from "@/components/Pagination";
import { useAnimals } from "@/hooks/useAnimals";
import { usePagination } from "@/hooks/usePagination";

function ListPage() {
  const {
    animals,
    loading,
    error,
    handleDeleteAnimal,
    handleUpdateAnimal,
    handleToggleAdopted,
  } = useAnimals();

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedAnimals,
    goToPage,
    itemsPerPage,
    totalItems,
  } = usePagination({ data: animals, itemsPerPage: 10 });

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
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Listado de Animales
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona los animales disponibles para adopción
        </p>
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
