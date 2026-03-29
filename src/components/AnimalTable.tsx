import React, { useCallback, useEffect, useState } from "react";

import { AnimalType } from "@/types";

import checkImageUrl from "@/utils/checkImageUrl";

import DeleteConfirmDialog from "./animals/DeleteConfirmDialog";
import EditAnimalModal from "./EditAnimalModal";
import EmptyState from "./animals/EmptyState";
import AnimalRow from "./animals/AnimalRow";

interface AnimalTableProps {
  animals: AnimalType[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (animal: AnimalType) => Promise<void>;
  onToggleAdopted: (id: string, adopted: boolean) => Promise<void>;
}

const AnimalTable: React.FC<AnimalTableProps> = ({
  animals,
  onDelete,
  onUpdate,
  onToggleAdopted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<AnimalType | null>(null);
  const [processedAnimals, setProcessedAnimals] =
    useState<AnimalType[]>(animals);

  useEffect(() => {
    let cancelled = false;

    const processPhotos = async () => {
      const updated = await Promise.all(
        animals.map(async (animal) => {
          if (typeof animal.photos === "string") {
            try {
              const photos = JSON.parse(animal.photos);
              const photoUrls = await Promise.all(
                photos.map((p: string) => checkImageUrl(p)),
              );
              return {
                ...animal,
                photos:
                  photoUrls.length > 0 ? photoUrls : ["/default-image.jpg"],
              };
            } catch {
              return { ...animal, photos: ["/default-image.jpg"] };
            }
          }
          return animal;
        }),
      );

      if (!cancelled) setProcessedAnimals(updated);
    };

    processPhotos();
    return () => {
      cancelled = true;
    };
  }, [animals]);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(confirmDelete);
      setDeleteMessage("Animal eliminado correctamente");
    } catch {
      setDeleteMessage("Error al eliminar el animal");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
      setTimeout(() => setDeleteMessage(""), 2500);
    }
  }, [confirmDelete, onDelete]);

  const handleUpdateAnimal = useCallback(
    async (updatedAnimal: AnimalType) => {
      try {
        await onUpdate(updatedAnimal);
        setEditingAnimal(null);
      } catch {
        // error handled by hook
      }
    },
    [onUpdate],
  );

  const isDialogOpen = isDeleting || !!deleteMessage || !!confirmDelete;

  return (
    <div className="relative">
      <DeleteConfirmDialog
        isOpen={isDialogOpen}
        isDeleting={isDeleting}
        deleteMessage={deleteMessage}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {editingAnimal && (
        <EditAnimalModal
          animal={editingAnimal}
          onClose={() => setEditingAnimal(null)}
          onUpdate={handleUpdateAnimal}
        />
      )}

      <div
        className={`transition-all duration-200 ${isDialogOpen ? "blur-sm" : ""}`}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
                <tr>
                  {[
                    { label: "Animal", className: "text-left" },
                    {
                      label: "Edad",
                      className: "text-left hidden md:table-cell",
                    },
                    {
                      label: "Tipo",
                      className: "text-left hidden lg:table-cell",
                    },
                    {
                      label: "Registro",
                      className: "text-left hidden xl:table-cell",
                    },
                    {
                      label: "Género",
                      className: "text-left hidden lg:table-cell",
                    },
                    {
                      label: "Tamaño",
                      className: "text-left hidden md:table-cell",
                    },
                    { label: "Estado", className: "text-center" },
                    { label: "Acciones", className: "text-right" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      scope="col"
                      className={`px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-white ${col.className}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedAnimals.length === 0 ? (
                  <EmptyState />
                ) : (
                  processedAnimals.map((animal) => (
                    <AnimalRow
                      key={animal.id}
                      animal={animal}
                      onToggleAdopted={onToggleAdopted}
                      onEdit={setEditingAnimal}
                      onDelete={setConfirmDelete}
                      isDeleting={isDeleting}
                      hasPendingDelete={!!confirmDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalTable;
