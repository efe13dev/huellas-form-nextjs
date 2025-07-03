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
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No hay noticias registradas</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Modal de confirmación de eliminación */}
      {(isDeleting || deleteMessage || confirmDelete) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-95 hover:scale-100">
            {isDeleting && (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-xl font-bold text-gray-800">
                  Eliminando noticia...
                </p>
              </div>
            )}

            {deleteMessage && !isDeleting && (
              <div className="flex flex-col items-center">
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <p className="text-xl font-bold text-gray-800">
                  {deleteMessage}
                </p>
              </div>
            )}

            {confirmDelete && !isDeleting && !deleteMessage && (
              <div className="text-center">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ¿Estás seguro de que quieres eliminar esta noticia?
                </h3>
                <p className="text-gray-600 mb-6">
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {truncateText(newsItem.title, 50)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {truncateText(newsItem.content, 100)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {newsItem.image ? (
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          Sin imagen
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(newsItem.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(newsItem.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
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
