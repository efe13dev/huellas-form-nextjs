"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createNews } from "@/app/services/newsService";
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
    defaultValues: { title: "", content: "", type: "", image: "" },
    mode: "onChange",
  });

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

        await createNews({ ...values, image: imageUrl });
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
    [form, selectedFile],
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setFileError(null);
      const reader = new FileReader();

      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      setFileError("No se selecciono ningun archivo.");
    }
  }, []);

  const isFormValid = form.formState.isValid && Boolean(selectedFile) && !fileError;

  return (
    <>
      <Form {...form}>
        <main className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-foreground">Nueva noticia</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Publica novedades, avisos y eventos para la comunidad.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-lg border border-border bg-white p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Contenido
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Titulo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Jornada de adopcion este sabado" {...field} />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage />
                          <span className="ml-auto text-xs text-muted-foreground">
                            {field.value?.length || 0}/65
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Contenido</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe el contenido de la noticia..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage />
                          <span className="ml-auto text-xs text-muted-foreground">
                            {field.value?.length || 0}/1000
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="urgente">Urgente</SelectItem>
                            <SelectItem value="perdido">Perdido</SelectItem>
                            <SelectItem value="encontrado">Encontrado</SelectItem>
                            <SelectItem value="adopcion">Adopcion</SelectItem>
                            <SelectItem value="evento">Evento</SelectItem>
                            <SelectItem value="noticia">Noticia</SelectItem>
                            <SelectItem value="salud">Salud</SelectItem>
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
                  Imagen destacada
                </p>
                <label
                  htmlFor="newsFileInput"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border py-8 transition-colors hover:bg-muted/50"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="h-40 w-full rounded-md object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Seleccionar imagen</p>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="newsFileInput"
                  accept="image/*"
                  className="hidden"
                />
                {fileError && <p className="mt-2 text-xs text-destructive">{fileError}</p>}
                {selectedFile && (
                  <p className="mt-2 truncate text-xs text-muted-foreground">{selectedFile.name}</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading || !isFormValid} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  "Publicar noticia"
                )}
              </Button>
            </form>
          </div>
        </main>
      </Form>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-xs rounded-lg border border-border bg-white p-6 text-center shadow-lg">
            <h3 className="text-sm font-semibold text-foreground">Noticia publicada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              La noticia ha sido creada correctamente.
            </p>
            <Button onClick={() => setShowConfirmation(false)} className="mt-4 w-full" size="sm">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
