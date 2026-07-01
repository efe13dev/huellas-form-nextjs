"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TursoData } from "@/types";

import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
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
          const body: TursoData = { name, description, age, type, size, genre, photos: urls };
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
    [selectedFiles, form, updatePreviewUrls],
  );

  const isFormReady = form.formState.isValid && selectedFiles.length > 0 && !fileError;

  return (
    <>
      <Form {...form}>
        <main className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-foreground">Registrar animal</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Anade un nuevo animal al sistema de adopciones.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-lg border border-border bg-white p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Informacion basica
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Luna" {...field} />
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
                        <FormLabel className="text-xs">Descripcion</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuenta su historia, comportamiento y necesidades..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage />
                          <span className="ml-auto text-xs text-muted-foreground">
                            {field.value.length}/500
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-white p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Caracteristicas
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
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo" />
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
                            <SelectTrigger>
                              <SelectValue placeholder="Edad" />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                            <SelectTrigger>
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

              <div className="rounded-lg border border-border bg-white p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fotos
                </p>
                <label
                  htmlFor="fileInput"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border py-8 transition-colors hover:bg-muted/50"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Seleccionar imagenes (max. {MAX_FILES})
                  </p>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                />
                {fileError && <p className="mt-2 text-xs text-destructive">{fileError}</p>}
                {previewUrls.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {previewUrls.map((src, i) => (
                      <div key={i} className="group relative h-16 w-16 flex-shrink-0">
                        <img
                          src={src}
                          alt={selectedFiles[i]?.name ?? `Imagen ${i + 1}`}
                          className="h-full w-full rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute -right-1 -top-1 rounded-full bg-foreground p-0.5 text-background opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {submitError && <p className="text-sm text-destructive">{submitError}</p>}

              <Button type="submit" disabled={isPending || !isFormReady} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar animal"
                )}
              </Button>
            </form>
          </div>
        </main>
      </Form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-xs rounded-lg border border-border bg-white p-6 text-center shadow-lg">
            <h3 className="text-sm font-semibold text-foreground">Registro exitoso</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              El animal ha sido registrado correctamente.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="mt-4 w-full" size="sm">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
