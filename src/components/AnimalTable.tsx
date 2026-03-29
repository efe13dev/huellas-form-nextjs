import React, { useCallback, useEffect, useState } from "react";

import { AnimalType } from "@/types";

import DeleteConfirmDialog from "./animals/DeleteConfirmDialog";
import EditAnimalModal from "./EditAnimalModal";
import EmptyState from "./animals/EmptyState";
import AnimalCard from "./animals/AnimalCard";
import checkImageUrl from "@/utils/checkImageUrl";

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
        {processedAnimals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {processedAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onToggleAdopted={onToggleAdopted}
                onEdit={setEditingAnimal}
                onDelete={setConfirmDelete}
                isDeleting={isDeleting}
                hasPendingDelete={!!confirmDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalTable;
