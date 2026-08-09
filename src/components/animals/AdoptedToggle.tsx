import React from "react";

interface AdoptedToggleProps {
  adopted: boolean;
  onChange: (adopted: boolean) => void;
}

const AdoptedToggle: React.FC<AdoptedToggleProps> = ({ adopted, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={Boolean(adopted)}
    aria-label="Cambiar estado de adopción"
    title="Cambiar estado de adopción"
    onClick={() => onChange(!adopted)}
    className={`group inline-flex items-center gap-2 rounded-full border px-1.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
      adopted
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400"
        : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 focus-visible:ring-amber-400"
    }`}
  >
    <span
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        adopted ? "bg-emerald-500" : "bg-amber-400"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
          adopted ? "translate-x-[1.125rem]" : "translate-x-0.5"
        }`}
      />
    </span>
    <span className="pr-1">{adopted ? "Adoptado" : "Disponible"}</span>
  </button>
);

export default AdoptedToggle;
