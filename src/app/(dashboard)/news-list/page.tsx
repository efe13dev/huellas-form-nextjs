"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

import NewsTable from "@/components/NewsTable";
import Pagination from "@/components/Pagination";
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

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Noticias</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{totalItems} publicadas</p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva
          </Link>
        </div>

        <NewsTable news={paginatedNews} onDelete={handleDeleteNews} onUpdate={handleUpdateNews} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </main>
  );
}

export default NewsListPage;
