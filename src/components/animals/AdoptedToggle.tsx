import React from "react";

interface AdoptedToggleProps {
  adopted: boolean;
  onChange: (adopted: boolean) => void;
}

const AdoptedToggle: React.FC<AdoptedToggleProps> = ({ adopted, onChange }) => (
  <button
    onClick={() => onChange(!adopted)}
    className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
      adopted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    }`}
  >
    {adopted ? "Adoptado" : "Disponible"}
  </button>
);

export default AdoptedToggle;
