'use client';
import React, { useState } from 'react';
import { NewsType } from '@/types';
import { Button } from '@/components/ui/button';
import EditNewsModal from './EditNewsModal';

interface NewsTableProps {
  news: NewsType[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (newsData: NewsType) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ news, onDelete, onUpdate }) => {
  const [editingNews, setEditingNews] = useState<NewsType | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      setIsDeleting(id);
      try {
        await onDelete(id);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleEdit = (newsItem: NewsType) => {
    setEditingNews(newsItem);
  };

  const handleUpdate = (updatedNews: NewsType) => {
    onUpdate(updatedNews);
    setEditingNews(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No hay noticias registradas</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
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
                      alt="Imagen de la noticia"
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
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
                    <Button
                      onClick={() => handleEdit(newsItem)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 border-blue-300 hover:border-blue-500"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(newsItem.id)}
                      variant="outline"
                      size="sm"
                      disabled={isDeleting === newsItem.id}
                      className="text-red-600 hover:text-red-900 border-red-300 hover:border-red-500 disabled:opacity-50"
                    >
                      {isDeleting === newsItem.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
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
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default NewsTable;
