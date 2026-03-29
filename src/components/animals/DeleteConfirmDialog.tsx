import React from "react";
import { AlertTriangle, Trash2, Loader2, CheckCircle2 } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl duration-200 animate-in fade-in zoom-in-95">
        {isDeleting && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-lg font-bold text-gray-800">
              Eliminando animal...
            </p>
            <p className="text-sm text-gray-500">
              Por favor, espera un momento
            </p>
          </div>
        )}

        {deleteMessage && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {deleteMessage}
            </p>
          </div>
        )}

        {!isDeleting && !deleteMessage && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                ¿Estás seguro?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Esta acción no se puede deshacer. El animal será eliminado
                permanentemente.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="rounded-lg px-6"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                className="gap-2 rounded-lg px-6"
              >
                <Trash2 className="h-4 w-4" />
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
