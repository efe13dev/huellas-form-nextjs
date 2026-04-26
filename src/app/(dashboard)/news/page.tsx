"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Newspaper,
  Send,
  UploadCloud,
  X,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createNews } from "@/app/services/newsService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(2).max(65),
  content: z.string().min(2).max(1000),
  type: z.string().optional(),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "",
      image: "",
    },
    mode: "onChange",
  });

  const uploadToCloudinary = useCallback(async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/cloudinary", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return { url: data.url };
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsLoading(true);

      try {
        if (!selectedFile) {
          setFileError("Por favor, selecciona una imagen.");
          setIsLoading(false);

          return;
        }

        const imageUrl = await uploadToCloudinary(selectedFile);

        const newsData = {
          ...values,
          image: imageUrl.url,
        };

        await createNews(newsData);

        form.reset();
        setSelectedFile(null);
        setImagePreview(null);
        setShowConfirmation(true);
      } catch (error) {
        console.error("Error creating news:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [form, selectedFile, uploadToCloudinary],
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setFileError(null);

      // Crear vista previa de la imagen
      const reader = new FileReader();

      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      setFileError("No se seleccionó ningún archivo.");
    }
  }, []);

  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");
  const watchedType = form.watch("type");
  const isFormValid = form.formState.isValid && Boolean(selectedFile) && !fileError;

  return (
    <>
      <Form {...form}>
        <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white sm:px-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-blue-100">
                      <Newspaper className="h-4 w-4" />
                      Gestión de publicaciones
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      Crear nueva noticia
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                      Publica novedades, avisos y eventos con una presentación clara para la
                      comunidad.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur">
                    <p className="text-sm text-slate-300">Estado</p>
                    <p className="mt-1 text-lg font-semibold">Borrador listo</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Contenido principal</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Completa la información que aparecerá en la noticia publicada.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      const titleLength = field.value?.length || 0;
                      const titleLimit = 65;
                      const isNearLimit = titleLength > titleLimit * 0.8;
                      const isOverLimit = titleLength > titleLimit;

                      return (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-800">
                            Título
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Jornada de adopción este sábado"
                              {...field}
                              className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none transition focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                            />
                          </FormControl>
                          <div className="mt-2 flex items-center justify-between gap-4">
                            <FormMessage className="text-sm text-red-600" />
                            <span
                              className={`ml-auto text-xs font-medium ${
                                isOverLimit
                                  ? "text-red-600"
                                  : isNearLimit
                                    ? "text-amber-600"
                                    : "text-slate-400"
                              }`}
                            >
                              {titleLength}/{titleLimit}
                            </span>
                          </div>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => {
                      const contentLength = field.value?.length || 0;
                      const contentLimit = 1000;
                      const isNearLimit = contentLength > contentLimit * 0.8;
                      const isOverLimit = contentLength > contentLimit;

                      return (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-800">
                            Contenido
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Escribe el contenido de la noticia con los detalles importantes..."
                              {...field}
                              className="min-h-[260px] rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none transition focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                            />
                          </FormControl>
                          <div className="mt-2 flex items-center justify-between gap-4">
                            <FormMessage className="text-sm text-red-600" />
                            <span
                              className={`ml-auto text-xs font-medium ${
                                isOverLimit
                                  ? "text-red-600"
                                  : isNearLimit
                                    ? "text-amber-600"
                                    : "text-slate-400"
                              }`}
                            >
                              {contentLength}/{contentLimit}
                            </span>
                          </div>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-800">
                          Tipo de noticia
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona un tipo opcional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="urgente">Urgente</SelectItem>
                            <SelectItem value="perdido">Perdido</SelectItem>
                            <SelectItem value="encontrado">Encontrado</SelectItem>
                            <SelectItem value="adopcion">Adopción</SelectItem>
                            <SelectItem value="evento">Evento</SelectItem>
                            <SelectItem value="noticia">Noticia</SelectItem>
                            <SelectItem value="salud">Salud</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <aside className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">Imagen destacada</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Añade una imagen clara y horizontal para mejorar la presentación.
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="image"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <label
                              htmlFor="fileInput"
                              className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
                            >
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Vista previa de la imagen"
                                  className="h-48 w-full rounded-xl object-cover shadow-sm"
                                />
                              ) : (
                                <>
                                  <div className="rounded-full bg-white p-4 text-blue-700 shadow-sm transition group-hover:scale-105">
                                    <UploadCloud className="h-8 w-8" />
                                  </div>
                                  <p className="mt-4 text-sm font-semibold text-slate-800">
                                    Selecciona una imagen
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    PNG, JPG o WEBP recomendado
                                  </p>
                                </>
                              )}
                              <Input
                                type="file"
                                onChange={handleFileChange}
                                id="fileInput"
                                accept="image/*"
                                className="sr-only"
                              />
                            </label>
                          </FormControl>
                          {fileError && <p className="mt-3 text-sm text-red-600">{fileError}</p>}
                          {selectedFile && (
                            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Archivo seleccionado
                              </p>
                              <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                                {selectedFile.name}
                              </p>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-950">Resumen</h2>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Título
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                          {watchedTitle || "Sin título todavía"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Tipo
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                          {watchedType || "Sin tipo"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Contenido
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm text-slate-700">
                          {watchedContent || "El contenido aparecerá aquí mientras escribes."}
                        </p>
                      </div>
                    </div>

                    <Button
                      className="mt-6 h-12 w-full rounded-xl bg-blue-700 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                      type="submit"
                      disabled={isLoading || !isFormValid}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Publicando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Publicar noticia
                        </span>
                      )}
                    </Button>
                  </section>
                </aside>
              </div>

              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-700" />
                    <p className="font-semibold text-slate-900">Publicando noticia...</p>
                    <p className="mt-1 text-sm text-slate-500">Esto puede tardar unos segundos.</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>
      </Form>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950">Noticia creada</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              La noticia ha sido creada y guardada correctamente.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                }}
                className="h-11 rounded-xl bg-blue-700 px-6 font-semibold text-white hover:bg-blue-800"
              >
                <X className="mr-2 h-4 w-4" />
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
