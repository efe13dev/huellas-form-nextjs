"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, ImagePlus, Loader2, Tag, X } from "lucide-react";

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

const MAX_FILES = 5;
const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  description: z
    .string()
    .min(2, "La descripcion debe tener al menos 2 caracteres")
    .max(500),
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
          const urls = await Promise.all(
            selectedFiles.map((file) => uploadToCloudinary(file)),
          );
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-4 max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Registro de Animal
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Registra nuevos animales en el sistema
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Tag className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Nombre del animal"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Cuenta su historia..."
                      className="min-h-[100px] resize-y pb-6"
                      rows={4}
                      {...field}
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">
                      {field.value.length}/500
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-1">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Detalles
            </p>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Tipo</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-sm">
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
                    <FormLabel className="text-xs">Edad</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-sm">
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
                    <FormLabel className="text-xs">Genero</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-sm">
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
                    <FormLabel className="text-xs">Tamano</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Tamano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Pequeno</SelectItem>
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

          <div className="pt-1">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Fotos
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 p-4">
              <label
                htmlFor="fileInput"
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Click para seleccionar imagenes
                  </p>
                  <p className="text-xs text-gray-400">
                    Maximo {MAX_FILES} imagenes
                  </p>
                </div>
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                id="fileInput"
                accept="image/*"
                className="hidden"
              />
            </div>
            {fileError && (
              <p className="mt-2 text-xs text-red-500">{fileError}</p>
            )}
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {previewUrls.map((src, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={src}
                      alt={selectedFiles[i]?.name ?? `Imagen ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full gap-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Registrando..." : "Registrar animal"}
          </Button>
        </form>
      </Form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl duration-200 animate-in fade-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Registro exitoso
            </h3>
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
