'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NewsType } from '@/types';
import NewsTable from '@/components/NewsTable';
import extractIdFromUrl from '@/utils/extractIdFromUrl';
import {
  fetchNews,
  deleteNews,
  updateNews
} from '../services/newsService';
import { deleteImageFromCloudinary } from '../services/cloudinaryService';

function NewsListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews()
      .then((result) => {
        if (!result || (Array.isArray(result) && result.length === 0)) {
          setError('No se encontraron noticias en la base de datos.');
          setNews([]);
        } else {
          setNews(Array.isArray(result) ? result : [result]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Error al cargar la lista de noticias. Por favor, inténtalo de nuevo más tarde.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!id) {
      throw new Error('Error: no hay que borrar nada');
    }

    try {
      // Obtener la noticia para acceder a la imagen
      const newsData = await fetchNews(id);
      const newsItem = Array.isArray(newsData) ? newsData[0] : newsData;
      
      // Si hay imagen, eliminarla de Cloudinary
      if (newsItem.image) {
        try {
          await deleteImageFromCloudinary(extractIdFromUrl(newsItem.image));
        } catch (imageError) {
          console.warn('Error al eliminar imagen de Cloudinary:', imageError);
          // Continuamos con la eliminación de la noticia aunque falle la imagen
        }
      }

      // Eliminar la noticia de la base de datos
      await deleteNews(id);
      
      // Actualizar el estado local
      setNews((prevNews) =>
        prevNews.filter((newsItem) => newsItem.id !== id)
      );
      
      return true;
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
      alert('Hubo un error al eliminar la noticia');
      return false;
    }
  }, []);

  const handleUpdate = useCallback(
    async (id: string, updatedFields: Partial<NewsType>) => {
      try {
        await updateNews(id, updatedFields);
        setNews((prevNews) =>
          prevNews.map((newsItem) =>
            newsItem.id === id ? { ...newsItem, ...updatedFields } : newsItem
          )
        );
      } catch (error) {
        console.error('Error al actualizar los datos de la noticia:', error);
        alert('Hubo un error al actualizar los datos de la noticia');
      }
    },
    []
  );

  if (status === 'loading' || loading) {
    return (
      <div className='text-center text-xl pt-20 font-semibold'>Cargando...</div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-600 text-lg pt-20 font-semibold'>
        {error}
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center text-slate-600'>
        Lista de Noticias
      </h1>
      <NewsTable
        news={news}
        onDelete={async (id: string) => {
          await handleDelete(id);
        }}
        onUpdate={(newsData: NewsType) =>
          handleUpdate(newsData.id, newsData)
        }
      />
    </div>
  );
}

export default NewsListPage;
