"use client";
import { FileText, Pencil, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";

import { NewsType } from "@/types";

import DeleteConfirmDialog from "./animals/DeleteConfirmDialog";
import EditNewsModal from "./EditNewsModal";

interface NewsTableProps {
  news: NewsType[];
  onDelete: (id: string) => Promise<boolean> | boolean | void;
  onUpdate: (id: string, updatedFields: Partial<NewsType>) => Promise<void>;
}

const NewsTable: React.FC<NewsTableProps> = ({ news, onDelete, onUpdate }) => {
  const [editingNews, setEditingNews] = useState<NewsType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        const deleted = await Promise.resolve(onDelete(confirmDelete));

        setDeleteMessage(
          deleted === false ? "Error al eliminar la noticia" : "Noticia eliminada correctamente",
        );
      } catch (error) {
        console.error("Error al eliminar la noticia:", error);
        setDeleteMessage("Error al eliminar la noticia");
      } finally {
        setIsDeleting(false);
        setConfirmDelete(null);
        setTimeout(() => setDeleteMessage(""), 2000);
      }
    }
  }, [confirmDelete, onDelete]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getTypeLabel = (type?: string) => {
    if (!type) return "Sin tipo";

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <p className="text-sm font-medium text-muted-foreground">No hay noticias registradas</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Publica una noticia para que aparezca aqui.
        </p>
      </div>
    );
  }

  const isDialogOpen = isDeleting || !!deleteMessage || !!confirmDelete;

  return (
    <div className="relative">
      <DeleteConfirmDialog
        isOpen={isDialogOpen}
        isDeleting={isDeleting}
        deleteMessage={deleteMessage}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Noticia</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Tipo</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Fecha</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {news.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="text-xs text-muted-foreground">{getTypeLabel(item.type)}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                  {formatDate(item.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditingNews(item)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingNews && (
        <EditNewsModal
          news={editingNews}
          onClose={() => setEditingNews(null)}
          onUpdate={async (id, fields) => {
            await onUpdate(id, fields);
            setEditingNews(null);
          }}
        />
      )}
    </div>
  );
};

export default NewsTable;
