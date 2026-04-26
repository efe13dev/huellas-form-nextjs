"use client";

import { AlertCircle, FileText, Newspaper, PlusCircle } from "lucide-react";
import Link from "next/link";

import { NewsType } from "@/types";

import NewsTable from "@/components/NewsTable";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useNews } from "@/hooks/useNews";
import { usePagination } from "@/hooks/usePagination";

function NewsListPage() {
  const { news, loading, error, handleDeleteNews, handleUpdateNews } = useNews();

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
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
            <p className="mt-4 text-lg font-semibold text-slate-900">Cargando noticias...</p>
            <p className="mt-1 text-sm text-slate-500">
              Estamos preparando el panel de publicaciones.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-950">No se pudo cargar la lista</h1>
            <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-blue-100">
                  <Newspaper className="h-4 w-4" />
                  Panel editorial
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lista de noticias</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Administra las publicaciones, actualiza información importante y retira noticias
                  obsoletas desde un único panel.
                </p>
              </div>
              <Button
                asChild
                className="h-11 rounded-xl bg-white px-5 font-semibold text-slate-950 shadow-sm hover:bg-blue-50"
              >
                <Link href="/news">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva noticia
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total publicadas</p>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                <Newspaper className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{totalItems}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Por página</p>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{itemsPerPage}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Página actual</p>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {currentPage}
              <span className="text-base font-semibold text-slate-400">/{totalPages || 1}</span>
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Publicaciones recientes</h2>
              <p className="mt-1 text-sm text-slate-500">
                Vista rápida de las noticias disponibles en la web.
              </p>
            </div>
          </div>

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
        </section>
      </div>
    </main>
  );
}

export default NewsListPage;
