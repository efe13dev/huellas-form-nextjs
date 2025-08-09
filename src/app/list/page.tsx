"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AnimalType } from "@/types";

import AnimalTable from "@/components/AnimalTable";
import Pagination from "@/components/Pagination";
import { useAnimals } from "@/hooks/useAnimals";
import { usePagination } from "@/hooks/usePagination";

function ListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { animals, loading, error, handleDeleteAnimal, handleUpdateAnimal } = useAnimals();

  // Configurar paginación
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedAnimals,
    goToPage,
    itemsPerPage,
    totalItems,
  } = usePagination({ data: animals, itemsPerPage: 10 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <div className="pt-20 text-center text-xl font-semibold">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="mb-6 text-center">
        <p className="text-gray-600">Gestiona los animales disponibles para adopción</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-center text-2xl font-bold text-slate-600">Listado de Animales</h1>
      <p className="mb-4 text-center text-gray-600">
        Gestiona los animales disponibles para adopción
      </p>
      <AnimalTable
        animals={paginatedAnimals}
        onDelete={handleDeleteAnimal}
        onUpdate={(animalData: AnimalType) => handleUpdateAnimal(animalData.id, animalData)}
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
