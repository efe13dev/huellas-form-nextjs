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
