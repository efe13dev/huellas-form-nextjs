"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileText, ImagePlus, Loader2, Send, Tag, X } from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TursoData } from "@/types";

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
import { ageLabels, genderLabels, sizeLabels, typeLabels } from "@/lib/labels";

const MAX_FILES = 5;
const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  description: z.string().min(2, "La descripcion debe tener al menos 2 caracteres").max(500),
  age: z.enum(["puppy", "young", "adult", "senior"]),
  type: z.enum(["dog", "cat", "other"]),
  size: z.enum(["small", "medium", "big"]),
  photos: z.array(z.string()).optional(),
  genre: z.enum(["male", "female", "unknown"]).default("unknown"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      age: undefined,
      type: undefined,
      size: undefined,
      photos: [],
      genre: "unknown",
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

    return data.url;
  }, []);

  const updatePreviewUrls = useCallback((files: File[]) => {
    setPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));

      return files.map((f) => URL.createObjectURL(f));
    });
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      setSubmitError(null);
      if (files.length > MAX_FILES) {
        setFileError(`Maximo ${MAX_FILES} imagenes.`);
        setSelectedFiles([]);
        updatePreviewUrls([]);
      } else if (files.length === 0) {
        setSelectedFiles([]);
        updatePreviewUrls([]);
        setFileError(null);
      } else {
        setSelectedFiles(files);
        setFileError(null);
        updatePreviewUrls(files);
      }
    },
    [updatePreviewUrls],
  );

  const removeFile = useCallback(
    (index: number) => {
      const next = selectedFiles.filter((_, i) => i !== index);

      setSelectedFiles(next);
      setFileError(null);
      updatePreviewUrls(next);
    },
    [selectedFiles, updatePreviewUrls],
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitError(null);
      if (selectedFiles.length === 0) {
        setFileError("Selecciona al menos una imagen.");

        return;
      }
      startTransition(async () => {
        try {
          const { name, description, age, type, size, genre } = values;
          const urls = await Promise.all(selectedFiles.map((file) => uploadToCloudinary(file)));
          const body: TursoData = {
            name,
            description,
            age,
            type,
            size,
            genre,
            photos: urls,
          };
          const res = await fetch("/api/adoption", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (res.ok) {
            form.reset();
            setSelectedFiles([]);
            updatePreviewUrls([]);
            setFileError(null);
            setShowSuccess(true);
          } else {
            const err = await res.json();

            setSubmitError(err.error ?? "Error al registrar el animal.");
          }
        } catch {
          setSubmitError("Error al registrar el animal. Intentalo de nuevo.");
        }
      });
    },
    [selectedFiles, uploadToCloudinary, form, updatePreviewUrls],
  );

  const watchedName = form.watch("name");
  const watchedDescription = form.watch("description");
  const watchedType = form.watch("type");
  const watchedAge = form.watch("age");
  const watchedSize = form.watch("size");
  const watchedGenre = form.watch("genre");
  const isFormReady = form.formState.isValid && selectedFiles.length > 0 && !fileError;

  return (
    <>
      <Form {...form}>
        <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white sm:px-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-100">
                      <Tag className="h-4 w-4" />
                      Gestión de adopciones
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      Registrar nuevo animal
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                      Añade animales al sistema con sus datos principales, características y galería
                      de imágenes.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur">
                    <p className="text-sm text-slate-300">Capacidad de fotos</p>
                    <p className="mt-1 text-lg font-semibold">Hasta {MAX_FILES} imágenes</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">
                        Información del animal
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Completa la ficha que se mostrará en el panel de adopciones.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-800">
                          Nombre
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              placeholder="Ej: Luna"
                              className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-none transition focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-800">
                          Descripción
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Cuenta su historia, comportamiento y necesidades..."
                              className="min-h-[220px] resize-y rounded-xl border-slate-200 bg-slate-50 pb-8 text-slate-900 shadow-none transition focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                              rows={6}
                              {...field}
                            />
                            <span className="absolute bottom-3 right-3 text-xs font-medium text-slate-400">
                              {field.value.length}/500
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm text-red-600" />
                      </FormItem>
                    )}
                  />

                  <div>
                    <p className="mb-4 text-sm font-semibold text-slate-800">Características</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-600">
                              Tipo
                            </FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-emerald-500 focus:ring-emerald-500">
                                  <SelectValue placeholder="Tipo de animal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dog">Perro</SelectItem>
                                <SelectItem value="cat">Gato</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-600">
                              Edad
                            </FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-emerald-500 focus:ring-emerald-500">
                                  <SelectValue placeholder="Rango de edad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="puppy">Cachorro</SelectItem>
                                <SelectItem value="young">Joven</SelectItem>
                                <SelectItem value="adult">Adulto</SelectItem>
                                <SelectItem value="senior">Anciano</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-600">
                              Género
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-emerald-500 focus:ring-emerald-500">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="unknown">Desconocido</SelectItem>
                                <SelectItem value="male">Macho</SelectItem>
                                <SelectItem value="female">Hembra</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-600">
                              Tamaño
                            </FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-emerald-500 focus:ring-emerald-500">
                                  <SelectValue placeholder="Tamaño" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">Pequeño</SelectItem>
                                <SelectItem value="medium">Mediano</SelectItem>
                                <SelectItem value="big">Grande</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">Galería de fotos</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Selecciona imágenes claras para mejorar la ficha del animal.
                        </p>
                      </div>
                    </div>

                    <label
                      htmlFor="fileInput"
                      className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50"
                    >
                      <div className="rounded-full bg-white p-4 text-emerald-700 shadow-sm transition group-hover:scale-105">
                        <ImagePlus className="h-8 w-8" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        Selecciona imágenes
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Máximo {MAX_FILES} imágenes</p>
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      id="fileInput"
                      accept="image/*"
                      className="hidden"
                    />
                    {fileError && <p className="mt-3 text-sm text-red-600">{fileError}</p>}
                    {previewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {previewUrls.map((src, i) => (
                          <div
                            key={i}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                          >
                            <img
                              src={src}
                              alt={selectedFiles[i]?.name ?? `Imagen ${i + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute right-1.5 top-1.5 rounded-full bg-slate-950/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-950">Resumen</h2>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Nombre
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {watchedName || "Sin nombre todavía"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Tipo
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {typeLabels[watchedType] ?? "Pendiente"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Edad
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {ageLabels[watchedAge] ?? "Pendiente"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Tamaño
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {sizeLabels[watchedSize] ?? "Pendiente"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Género
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {genderLabels[watchedGenre] ?? "Pendiente"}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Descripción
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm text-slate-700">
                          {watchedDescription || "La descripción aparecerá aquí mientras escribes."}
                        </p>
                      </div>
                    </div>

                    {submitError && (
                      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {submitError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isPending || !isFormReady}
                      className="mt-6 h-12 w-full rounded-xl bg-emerald-700 font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Registrando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Registrar animal
                        </span>
                      )}
                    </Button>
                  </section>
                </aside>
              </div>

              {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-700" />
                    <p className="font-semibold text-slate-900">Registrando animal...</p>
                    <p className="mt-1 text-sm text-slate-500">Estamos subiendo las imágenes.</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>
      </Form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl duration-200 animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Registro exitoso</h3>
            <p className="mt-1 text-sm text-gray-500">
              El animal ha sido registrado correctamente.
            </p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="mt-5 w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
