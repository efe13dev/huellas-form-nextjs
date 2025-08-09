"use client";
import React, { useState, useCallback } from "react";

import { NewsType } from "@/types";

import EditNewsModal from "./EditNewsModal";

interface NewsTableProps {
  news: NewsType[];
  onDelete: (id: string) => void;
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
        onDelete(confirmDelete);
        setDeleteMessage("Noticia eliminada correctamente");
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

  if (news.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg text-gray-500">No hay noticias registradas</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Modal de confirmación de eliminación */}
      {(isDeleting || deleteMessage || confirmDelete) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md scale-95 transform rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 ease-out hover:scale-100">
            {isDeleting && (
              <div className="flex flex-col items-center">
                <div className="mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-indigo-600"></div>
                <p className="text-xl font-bold text-gray-800">Eliminando noticia...</p>
              </div>
            )}

            {deleteMessage && !isDeleting && (
              <div className="flex flex-col items-center">
                <div className="mb-4 text-6xl text-green-600">✓</div>
                <p className="text-xl font-bold text-gray-800">{deleteMessage}</p>
              </div>
            )}

            {confirmDelete && !isDeleting && !deleteMessage && (
              <div className="text-center">
                <div className="mb-4 text-6xl text-red-600">⚠️</div>
                <h3 className="mb-4 text-xl font-bold text-gray-800">
                  ¿Estás seguro de que quieres eliminar esta noticia?
                </h3>
                <p className="mb-6 text-gray-600">Esta acción no se puede deshacer.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleCancelDelete}
                    className="rounded-lg bg-gray-300 px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="rounded-lg bg-red-600 px-6 py-2 text-white transition-colors duration-200 hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla de noticias */}
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contenido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {news.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {truncateText(newsItem.title, 50)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs text-sm text-gray-900">
                      {truncateText(newsItem.content, 100)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {newsItem.image ? (
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
                        <span className="text-xs text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(newsItem.date)}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(newsItem.id)}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-red-700"
                      >
                        Eliminar
                      </button>
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
