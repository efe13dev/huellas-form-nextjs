import React from "react";
import { PackageOpen } from "lucide-react";

const EmptyState: React.FC = () => (
  <tr>
    <td className="px-6 py-16 text-center" colSpan={8}>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <PackageOpen className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            No hay animales registrados
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Añade un nuevo animal para comenzar
          </p>
        </div>
      </div>
    </td>
  </tr>
);

export default EmptyState;
