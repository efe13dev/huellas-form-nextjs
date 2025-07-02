'use client';
import React, { useState, useCallback } from 'react';
import { NewsType } from '@/types';
import EditNewsModal from './EditNewsModal';

interface NewsTableProps {
  news: NewsType[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (newsData: NewsType) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ news, onDelete, onUpdate }) => {
  const [editingNews, setEditingNews] = useState<NewsType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = useCallback((id: string) => {
    setConfirmDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        await onDelete(confirmDelete);
        setDeleteMessage('Noticia eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar la noticia:', error);
        setDeleteMessage('Error al eliminar la noticia');
      } finally {
        setIsDeleting(false);
        setConfirmDelete(null);
        setTimeout(() => setDeleteMessage(''), 2000);
      }
    }
  }, [confirmDelete, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDelete(null);
  }, []);

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
    <div className='relative'>
      {/* Modal de confirmación de eliminación */}
      {(isDeleting || deleteMessage || confirmDelete) && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
          <div className='bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-95 hover:scale-100'>
            {isDeleting && (
              <div className='flex flex-col items-center'>
                <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4'></div>
                <p className='text-xl font-bold text-gray-800'>Eliminando noticia...</p>
                <p className='text-gray-600 mt-2'>Por favor, espera un momento</p>
              </div>
            )}
            {deleteMessage && (
              <div className='text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                  </svg>
                </div>
                <p className='text-lg font-semibold text-gray-800'>{deleteMessage}</p>
              </div>
            )}
            {confirmDelete && !isDeleting && (
              <div className='text-center'>
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'></path>
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>¿Estás seguro?</h3>
                <p className='text-gray-600 mb-6'>Esta acción no se puede deshacer. La noticia será eliminada permanentemente.</p>
                <div className='flex justify-center space-x-4'>
                  <button
                    onClick={handleCancelDelete}
                    className='px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className='px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center space-x-2'
                    disabled={isDeleting}
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'></path>
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`transition-all duration-300 ${isDeleting || confirmDelete ? 'filter blur-sm' : ''}`}>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2 p-1.5 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(newsItem.id)}
                      disabled={isDeleting || confirmDelete !== null}
                      className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
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
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default NewsTable;
