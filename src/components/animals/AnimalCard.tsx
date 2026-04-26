import { CalendarDays, Pencil, Ruler, Trash2 } from "lucide-react";
import React from "react";

import { AnimalType } from "@/types";

import AdoptedToggle from "./AdoptedToggle";

import { ageLabels, genderLabels, sizeLabels, typeIcons, typeLabels } from "@/lib/labels";

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
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        animal.adopted
          ? "border-emerald-200 ring-1 ring-emerald-100"
          : "border-slate-200 ring-1 ring-transparent"
      }`}
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          className="h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
          src={photoUrls[0]}
          alt={animal.name}
          onClick={() => onEdit(animal)}
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
          <span>{typeIcons[animalType] ?? "🐾"}</span>
          {typeLabels[animalType] ?? animal.type}
        </div>
        <div
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
            animal.adopted ? "bg-emerald-600 text-white" : "bg-amber-400 text-slate-950"
          }`}
        >
          {animal.adopted ? "Adoptado" : "Disponible"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-950">{animal.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {genderLabels[animalGender] ?? "Desconocido"}
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={() => onEdit(animal)}
              className="rounded-xl border border-slate-200 p-2 text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-800"
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(animal.id)}
              disabled={isDeleting || hasPendingDelete}
              className="rounded-xl border border-red-100 p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{animal.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {ageLabels[animal.age] ?? animal.age}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            <Ruler className="h-3 w-3" />
            {sizeLabels[animal.size] ?? animal.size}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <CalendarDays className="h-3 w-3" />
            {new Date(animal.register_date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
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
