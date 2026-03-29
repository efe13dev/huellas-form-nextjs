import React from "react";
import { Pencil, Trash2 } from "lucide-react";

import { AnimalType } from "@/types";
import {
  ageLabels,
  sizeLabels,
  genderLabels,
  typeLabels,
  typeIcons,
  genderIcons,
} from "@/lib/labels";

import AdoptedToggle from "./AdoptedToggle";

interface AnimalRowProps {
  animal: AnimalType;
  onToggleAdopted: (id: string, adopted: boolean) => void;
  onEdit: (animal: AnimalType) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  hasPendingDelete: boolean;
}

const AnimalRow: React.FC<AnimalRowProps> = ({
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
    <tr
      className={`group transition-colors duration-150 hover:bg-gray-50/80 ${animal.adopted ? "bg-green-50/60" : ""}`}
    >
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="group/img relative h-14 w-14 flex-shrink-0">
            <img
              className="h-14 w-14 cursor-pointer rounded-lg border border-gray-200 object-cover shadow-sm transition-shadow group-hover/img:shadow-md"
              src={photoUrls[0]}
              alt={animal.name}
              onClick={() => onEdit(animal)}
            />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 text-sm shadow">
              {typeIcons[animalType] ?? "\ud83d\udc3e"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                {animal.name}
              </h4>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {genderLabels[animalGender] ?? "Desconocido"}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {ageLabels[animal.age] ?? animal.age}
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                {sizeLabels[animal.size] ?? animal.size}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="hidden whitespace-nowrap px-6 py-4 md:table-cell">
        <span className="text-sm text-gray-700">
          {ageLabels[animal.age] ?? animal.age}
        </span>
      </td>

      <td className="hidden whitespace-nowrap px-6 py-4 lg:table-cell">
        <div className="flex items-center gap-2">
          <span className="text-base">
            {typeIcons[animalType] ?? "\ud83d\udc3e"}
          </span>
          <span className="text-sm text-gray-700">
            {typeLabels[animalType] ?? animal.type}
          </span>
        </div>
      </td>

      <td className="hidden whitespace-nowrap px-6 py-4 xl:table-cell">
        <span className="text-sm text-gray-500">
          {new Date(animal.register_date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </td>

      <td className="hidden whitespace-nowrap px-6 py-4 lg:table-cell">
        <div className="flex items-center gap-1.5">
          <span className="text-base">
            {genderIcons[animalGender] ?? "\u2753"}
          </span>
          <span className="text-sm text-gray-700">
            {genderLabels[animalGender] ?? "Desconocido"}
          </span>
        </div>
      </td>

      <td className="hidden whitespace-nowrap px-6 py-4 md:table-cell">
        <span className="text-sm text-gray-700">
          {sizeLabels[animal.size] ?? animal.size}
        </span>
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-center">
        <AdoptedToggle
          adopted={animal.adopted}
          onChange={(adopted) => onToggleAdopted(animal.id, adopted)}
        />
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-right">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onEdit(animal)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(animal.id)}
            disabled={isDeleting || hasPendingDelete}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(AnimalRow);
