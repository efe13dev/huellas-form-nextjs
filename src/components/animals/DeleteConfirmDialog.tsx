import React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  deleteMessage: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  isDeleting,
  deleteMessage,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-lg">
        {isDeleting && (
          <div className="flex flex-col items-center gap-3 py-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Eliminando...</p>
          </div>
        )}

        {deleteMessage && !isDeleting && (
          <div className="py-2 text-center">
            <p className="text-sm font-medium text-foreground">{deleteMessage}</p>
          </div>
        )}

        {!isDeleting && !deleteMessage && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Confirmar eliminacion</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Esta accion no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancelar
              </Button>
              <Button variant="destructive" size="sm" onClick={onConfirm}>
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
