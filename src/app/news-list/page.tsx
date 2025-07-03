'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NewsType } from '@/types';
import NewsTable from '@/components/NewsTable';
import { useNews } from '@/hooks/useNews';

function NewsListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { news, loading, error, handleDeleteNews, handleUpdateNews } = useNews();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteNews(id);
      return true;
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
      alert('Hubo un error al eliminar la noticia');
      return false;
    }
  };

  const handleUpdate = async (
    id: string,
    updatedFields: Partial<NewsType>
  ) => {
    try {
      await handleUpdateNews(id, updatedFields);
    } catch (error) {
      console.error('Error al actualizar los datos de la noticia:', error);
      alert('Hubo un error al actualizar los datos de la noticia');
    }
  };

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
        onUpdate={(id: string, updatedFields: Partial<NewsType>) =>
          handleUpdate(id, updatedFields)
        }
      />
    </div>
  );
}

export default NewsListPage;
