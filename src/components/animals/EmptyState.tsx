import React from "react";

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
    <p className="text-sm font-medium text-muted-foreground">No hay animales registrados</p>
    <p className="mt-1 text-xs text-muted-foreground/70">Registra un nuevo animal para comenzar</p>
  </div>
);

export default EmptyState;
