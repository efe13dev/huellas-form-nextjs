import React from "react";

interface AdoptedToggleProps {
  adopted: boolean;
  onChange: (adopted: boolean) => void;
}

const AdoptedToggle: React.FC<AdoptedToggleProps> = ({ adopted, onChange }) => (
  <label className="relative inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      className="peer sr-only"
      checked={adopted}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div
      className={`h-6 w-11 rounded-full transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
        adopted ? "bg-green-500" : "bg-gray-200"
      }`}
    />
    <span className="ml-2 hidden text-sm font-medium text-gray-700 md:inline">
      {adopted ? "Adoptado" : "Disponible"}
    </span>
  </label>
);

export default AdoptedToggle;
