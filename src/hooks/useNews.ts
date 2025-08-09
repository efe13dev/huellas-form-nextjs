"use client";
import { useState, useEffect, useCallback } from "react";

import { NewsType } from "@/types";

import {
  fetchNews as fetchNewsService,
  deleteNews as deleteNewsService,
  updateNews as updateNewsService,
  createNews as createNewsService,
} from "@/app/services/newsService";
import { deleteImageFromCloudinary } from "@/app/services/cloudinaryService";
import extractIdFromUrl from "@/utils/extractIdFromUrl";

export const useNews = (initialNews: NewsType[] = []) => {
  const [news, setNews] = useState<NewsType[]>(initialNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const result = await fetchNewsService();

        if (!result || (Array.isArray(result) && result.length === 0)) {
          setError("No se encontraron noticias en la base de datos.");
          setNews([]);
        } else {
          setNews(Array.isArray(result) ? result : [result]);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar la lista de noticias. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  const createNews = async (newsData: Omit<NewsType, "id" | "date">) => {
    try {
      const newNews = await createNewsService(newsData);

      setNews((prevNews) => [...prevNews, newNews]);

      return newNews;
    } catch (error) {
      console.error("Error al crear la noticia:", error);
      throw new Error("Hubo un error al crear la noticia");
    }
  };

  const handleUpdateNews = async (id: string, updatedFields: Partial<NewsType>) => {
    try {
      await updateNewsService(id, updatedFields);
      setNews((prevNews) =>
        prevNews.map((newsItem) =>
          newsItem.id === id ? { ...newsItem, ...updatedFields } : newsItem,
        ),
      );
    } catch (error) {
      console.error("Error al actualizar la noticia:", error);
      throw new Error("Hubo un error al actualizar la noticia");
    }
  };

  const handleDeleteNews = useCallback(async (id: string) => {
    if (!id) {
      throw new Error("Error: el ID es necesario para eliminar la noticia");
    }

    try {
      const newsData = await fetchNewsService(id);
      const newsItem = Array.isArray(newsData) ? newsData[0] : newsData;

      if (newsItem.image) {
        try {
          await deleteImageFromCloudinary(extractIdFromUrl(newsItem.image));
        } catch (imageError) {
          console.warn("Error al eliminar imagen de Cloudinary:", imageError);
        }
      }

      await deleteNewsService(id);
      setNews((prevNews) => prevNews.filter((item) => item.id !== id));

      return true;
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
      throw new Error("Hubo un error al eliminar la noticia");
    }
  }, []);

  return {
    news,
    loading,
    error,
    createNews,
    handleUpdateNews,
    handleDeleteNews,
  };
};
