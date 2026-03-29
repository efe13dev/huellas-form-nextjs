import React from "react";
import { PackageOpen } from "lucide-react";

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16">
    <PackageOpen className="mb-3 h-10 w-10 text-gray-300" />
    <h3 className="text-sm font-medium text-gray-600">
      No hay animales registrados
    </h3>
    <p className="mt-1 text-xs text-gray-400">
      Añade un nuevo animal para comenzar
    </p>
  </div>
);

export default EmptyState;
