"use client";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import React, { useCallback, useState } from "react";

import { NewsType } from "@/types";

import EditNewsModal from "./EditNewsModal";

import { Button } from "@/components/ui/button";

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

  const handleDeleteClick = useCallback((id: string) => {
    setConfirmDelete(id);
  }, []);

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

  const handleCancelDelete = useCallback(() => {
    setConfirmDelete(null);
  }, []);

  const handleEdit = (newsItem: NewsType) => {
    setEditingNews(newsItem);
  };

  const handleUpdate = async (id: string, updatedFields: Partial<NewsType>) => {
    await onUpdate(id, updatedFields);
    setEditingNews(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  const getTypeLabel = (type?: string) => {
    if (!type) return "Sin tipo";

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (news.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
          <FileText className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-slate-900">No hay noticias registradas</p>
        <p className="mt-2 text-sm text-slate-500">
          Cuando publiques noticias aparecerán en esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Modal de confirmación de eliminación */}
      {(isDeleting || deleteMessage || confirmDelete) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            {isDeleting && (
              <div className="flex flex-col items-center">
                <Loader2 className="mb-5 h-12 w-12 animate-spin text-blue-700" />
                <p className="text-xl font-bold text-slate-950">Eliminando noticia...</p>
                <p className="mt-2 text-sm text-slate-500">Estamos actualizando la lista.</p>
              </div>
            )}

            {deleteMessage && !isDeleting && (
              <div className="flex flex-col items-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <p className="text-xl font-bold text-slate-950">{deleteMessage}</p>
              </div>
            )}

            {confirmDelete && !isDeleting && !deleteMessage && (
              <div>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  ¿Estás seguro de que quieres eliminar esta noticia?
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Esta acción no se puede deshacer.
                </p>
                <div className="mt-7 flex justify-center gap-3">
                  <Button
                    onClick={handleCancelDelete}
                    variant="outline"
                    className="h-11 rounded-xl px-5"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    className="h-11 rounded-xl bg-red-600 px-5 text-white hover:bg-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla de noticias */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Noticia
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fecha
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {news.map((newsItem) => (
                <tr key={newsItem.id} className="transition hover:bg-slate-50/70">
                  <td className="min-w-[420px] px-6 py-5">
                    <div className="flex items-center gap-4">
                      {newsItem.image ? (
                        <img
                          src={newsItem.image}
                          alt={newsItem.title}
                          className="h-16 w-20 rounded-xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-950">
                          {truncateText(newsItem.title, 65)}
                        </div>
                        <div className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                          {truncateText(newsItem.content, 130)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                      <Tag className="h-3.5 w-3.5" />
                      {getTypeLabel(newsItem.type)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {formatDate(newsItem.date)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(newsItem)}
                        title="Editar"
                        className="h-10 w-10 rounded-xl border-slate-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(newsItem.id)}
                        title="Eliminar"
                        className="h-10 w-10 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {editingNews && (
        <EditNewsModal
          news={editingNews}
          onClose={() => setEditingNews(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default NewsTable;
