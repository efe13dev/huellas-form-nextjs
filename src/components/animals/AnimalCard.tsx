import React from "react";
import { Pencil, Trash2 } from "lucide-react";

import AdoptedToggle from "./AdoptedToggle";

import { AnimalType } from "@/types";
import {
  ageLabels,
  sizeLabels,
  genderLabels,
  typeLabels,
  typeIcons,
} from "@/lib/labels";

interface AnimalCardProps {
  animal: AnimalType;
  onToggleAdopted: (id: string, adopted: boolean) => void;
  onEdit: (animal: AnimalType) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  hasPendingDelete: boolean;
}

const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  onToggleAdopted,
  onEdit,
  onDelete,
  isDeleting,
  hasPendingDelete,
}) => {
  const photoUrls =
    Array.isArray(animal.photos) && animal.photos.length > 0
      ? animal.photos
      : ["/default-image.jpg"];
  const animalType = animal.type as string;
  const animalGender = animal.genre as string;

  return (
    <div
      className={`group relative flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        animal.adopted
          ? "border-l-4 border-l-green-500 border-y-gray-200 border-r-gray-200"
          : "border-gray-200"
      }`}
    >
      <div className="relative h-20 w-20 flex-shrink-0">
        <img
          className="h-20 w-20 cursor-pointer rounded-lg border border-gray-100 object-cover"
          src={photoUrls[0]}
          alt={animal.name}
          onClick={() => onEdit(animal)}
        />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1 text-xs shadow">
          {typeIcons[animalType] ?? "\ud83d\udc3e"}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {animal.name}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {typeLabels[animalType] ?? animal.type}
              <span className="mx-1.5 text-gray-300">&middot;</span>
              {genderLabels[animalGender] ?? "Desconocido"}
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={() => onEdit(animal)}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(animal.id)}
              disabled={isDeleting || hasPendingDelete}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {ageLabels[animal.age] ?? animal.age}
          </span>
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
            {sizeLabels[animal.size] ?? animal.size}
          </span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {new Date(animal.register_date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-2.5">
          <AdoptedToggle
            adopted={animal.adopted}
            onChange={(adopted) => onToggleAdopted(animal.id, adopted)}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnimalCard);
