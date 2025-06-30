import { NewsType } from '@/types';

export async function createNews(news: Omit<NewsType, 'id' | 'date'>): Promise<NewsType> {
  const response = await fetch('/api/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(news)
  });

  if (!response.ok) {
    throw new Error('Error al crear la noticia');
  }

  return response.json();
}

export async function fetchNews(id?: string): Promise<NewsType | NewsType[]> {
  const url = id ? `/api/news/${id}` : '/api/news';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Error al obtener las noticias');
  }
  
  return response.json();
}

export async function updateNews(id: string, updates: Partial<NewsType>): Promise<NewsType> {
  const response = await fetch(`/api/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar la noticia');
  }
  
  return response.json();
}

export async function deleteNews(id: string): Promise<void> {
  const response = await fetch(`/api/news/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar la noticia');
  }
}
