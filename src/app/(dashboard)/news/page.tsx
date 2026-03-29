"use client";
import React, { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNews } from "@/app/services/newsService";

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

  const isFormValid = form.formState.isValid && selectedFile && !fileError;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative mx-auto mt-4 max-w-2xl space-y-6 rounded-lg bg-white px-4 py-8 shadow-md"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Añadir Nueva Noticia
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Crea y publica nuevas noticias para mantener informada a la comunidad sobre las últimas
            actualizaciones y eventos
          </p>

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
                  <FormLabel className="font-medium text-gray-700">Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce un título ..."
                      {...field}
                      className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <div className="mt-1 flex items-center justify-between">
                    <FormMessage className="text-red-600" />
                    <span
                      className={`text-sm ${
                        isOverLimit
                          ? "font-semibold text-red-600"
                          : isNearLimit
                            ? "text-yellow-600"
                            : "text-gray-500"
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
                  <FormLabel className="font-medium text-gray-700">Contenido</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe el contenido de la noticia ..."
                      {...field}
                      className="min-h-[200px] rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <div className="mt-1 flex items-center justify-between">
                    <FormMessage className="text-red-600" />
                    <span
                      className={`text-sm ${
                        isOverLimit
                          ? "font-semibold text-red-600"
                          : isNearLimit
                            ? "text-yellow-600"
                            : "text-gray-500"
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
                <FormLabel className="font-medium text-gray-700">
                  Tipo de Noticia (Opcional)
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecciona un tipo" />
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

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">Imagen</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    id="fileInput"
                    accept="image/*"
                    className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
                {selectedFile && <p className="mt-2 text-sm text-gray-600">{selectedFile.name}</p>}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">Vista previa:</p>
                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-2">
                      <img
                        src={imagePreview}
                        alt="Vista previa de la imagen"
                        className="mx-auto block h-auto max-h-64 max-w-full rounded-md object-contain"
                      />
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              className="w-full transform rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Enviando..." : "Añadir Noticia"}
            </Button>
          </div>

          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white bg-opacity-90">
              <div className="flex flex-col items-center">
                <div className="mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                <p className="font-medium text-blue-600">Enviando noticia...</p>
              </div>
            </div>
          )}
        </form>
      </Form>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <h3 className="mb-4 text-xl font-bold">¡Noticia creada!</h3>
            <p className="mb-4">La noticia ha sido creada y guardada correctamente.</p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                }}
                className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
