"use client";

import { NewsType } from "@/types";

import NewsTable from "@/components/NewsTable";
import Pagination from "@/components/Pagination";
import { useNews } from "@/hooks/useNews";
import { usePagination } from "@/hooks/usePagination";

function NewsListPage() {
  const { news, loading, error, handleDeleteNews, handleUpdateNews } =
    useNews();

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedNews,
    goToPage,
    itemsPerPage,
    totalItems,
  } = usePagination({ data: news, itemsPerPage: 10 });

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteNews(id);

      return true;
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
      alert("Hubo un error al eliminar la noticia");

      return false;
    }
  };

  const handleUpdate = async (id: string, updatedFields: Partial<NewsType>) => {
    try {
      await handleUpdateNews(id, updatedFields);
    } catch (error) {
      console.error("Error al actualizar los datos de la noticia:", error);
      alert("Hubo un error al actualizar los datos de la noticia");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 text-center text-xl font-semibold">Cargando...</div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 text-center text-lg font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-center text-2xl font-bold text-slate-600">
        Lista de Noticias
      </h1>
      <p className="mb-4 text-center text-gray-600">
        Administra y revisa todas las noticias publicadas, actualiza contenido o
        elimina noticias obsoletas
      </p>
      <NewsTable
        news={paginatedNews}
        onDelete={handleDelete}
        onUpdate={(id: string, updatedFields: Partial<NewsType>) =>
          handleUpdate(id, updatedFields)
        }
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}

export default NewsListPage;
