import React, { useCallback, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { AnimalType } from "@/types";

import DeleteConfirmDialog from "./animals/DeleteConfirmDialog";
import EmptyState from "./animals/EmptyState";
import EditAnimalModal from "./EditAnimalModal";
import AdoptedToggle from "./animals/AdoptedToggle";

import { ageLabels, genderLabels, sizeLabels, typeLabels } from "@/lib/labels";

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

  const processedAnimals = animals.map((animal) => {
    if (typeof animal.photos === "string") {
      try {
        const photos = JSON.parse(animal.photos);

        return {
          ...animal,
          photos: Array.isArray(photos) && photos.length > 0 ? photos : ["/default-image.jpg"],
        };
      } catch {
        return { ...animal, photos: ["/default-image.jpg"] };
      }
    }

    return animal;
  });

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

      {processedAnimals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Foto</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Tipo</th>
                <th className="hidden px-4 py-2.5 text-xs font-medium text-muted-foreground md:table-cell">
                  Sexo
                </th>
                <th className="hidden px-4 py-2.5 text-xs font-medium text-muted-foreground sm:table-cell">
                  Edad
                </th>
                <th className="hidden px-4 py-2.5 text-xs font-medium text-muted-foreground lg:table-cell">
                  Tamano
                </th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {processedAnimals.map((animal) => {
                const photoUrl =
                  Array.isArray(animal.photos) && animal.photos.length > 0
                    ? animal.photos[0]
                    : "/default-image.jpg";

                return (
                  <tr key={animal.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <img
                        src={photoUrl}
                        alt={animal.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-image.jpg";
                        }}
                        onClick={() => setEditingAnimal(animal)}
                        className="h-8 w-8 cursor-pointer rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => setEditingAnimal(animal)}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        {animal.name}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {typeLabels[animal.type] ?? animal.type}
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                      {genderLabels[animal.genre] ?? "Desconocido"}
                    </td>
                    <td className="hidden px-4 py-2.5 sm:table-cell">
                      <span className="text-muted-foreground">
                        {ageLabels[animal.age] ?? animal.age}
                      </span>
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground lg:table-cell">
                      {sizeLabels[animal.size] ?? animal.size}
                    </td>
                    <td className="px-4 py-2.5">
                      <AdoptedToggle
                        adopted={animal.adopted}
                        onChange={(adopted) => onToggleAdopted(animal.id, adopted)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingAnimal(animal)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(animal.id)}
                          disabled={isDeleting || !!confirmDelete}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnimalTable;
