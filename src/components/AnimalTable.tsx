import React, { useCallback, useEffect, useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

import { AnimalType } from "@/types";

import DeleteConfirmDialog from "./animals/DeleteConfirmDialog";
import EmptyState from "./animals/EmptyState";
import EditAnimalModal from "./EditAnimalModal";
import AdoptedToggle from "./animals/AdoptedToggle";

import checkImageUrl from "@/utils/checkImageUrl";
import { ageLabels, genderLabels, sizeLabels, typeIcons, typeLabels } from "@/lib/labels";

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
  const [processedAnimals, setProcessedAnimals] = useState<AnimalType[]>(animals);

  useEffect(() => {
    let cancelled = false;

    const processPhotos = async () => {
      const updated = await Promise.all(
        animals.map(async (animal) => {
          if (typeof animal.photos === "string") {
            try {
              const photos = JSON.parse(animal.photos);
              const photoUrls = await Promise.all(photos.map((p: string) => checkImageUrl(p)));

              return {
                ...animal,
                photos: photoUrls.length > 0 ? photoUrls : ["/default-image.jpg"],
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

      <div className={`transition-all duration-200 ${isDialogOpen ? "blur-sm" : ""}`}>
        {processedAnimals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-2xl sm:border sm:border-slate-200">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-4 py-3 font-semibold text-slate-500">Foto</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Nombre</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Tipo</th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-500 md:table-cell">
                    Sexo
                  </th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-500 sm:table-cell">
                    Edad
                  </th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-500 lg:table-cell">
                    Tamaño
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Estado</th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-500 lg:table-cell">
                    Registro
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedAnimals.map((animal) => {
                  const photoUrl =
                    Array.isArray(animal.photos) && animal.photos.length > 0
                      ? animal.photos[0]
                      : "/default-image.jpg";

                  return (
                    <tr
                      key={animal.id}
                      className={`group transition-colors hover:bg-slate-50 ${
                        animal.adopted ? "bg-emerald-50/40 hover:bg-emerald-50/60" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <img
                          src={photoUrl}
                          alt={animal.name}
                          onClick={() => setEditingAnimal(animal)}
                          className="h-10 w-10 cursor-pointer rounded-lg object-cover ring-1 ring-slate-200 transition hover:ring-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingAnimal(animal)}
                          className="font-semibold text-slate-950 hover:text-emerald-700 hover:underline"
                        >
                          {animal.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="mr-1">{typeIcons[animal.type] ?? "🐾"}</span>
                        {typeLabels[animal.type] ?? animal.type}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                        {genderLabels[animal.genre] ?? "Desconocido"}
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {ageLabels[animal.age] ?? animal.age}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                        {sizeLabels[animal.size] ?? animal.size}
                      </td>
                      <td className="px-4 py-3">
                        <AdoptedToggle
                          adopted={animal.adopted}
                          onChange={(adopted) => onToggleAdopted(animal.id, adopted)}
                        />
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(animal.register_date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingAnimal(animal)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(animal.id)}
                            disabled={isDeleting || !!confirmDelete}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default AnimalTable;
