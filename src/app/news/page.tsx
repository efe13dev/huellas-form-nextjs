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
        // eslint-disable-next-line no-console
        console.error("Error creating news:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [form, selectedFile, uploadToCloudinary]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const isFormValid = form.formState.isValid && selectedFile && !fileError;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto py-8 px-4 bg-white shadow-md rounded-lg mt-4 relative"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Añadir Nueva Noticia
          </h2>

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
                  <FormLabel className="text-gray-700 font-medium">
                    Título
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce un título ..."
                      {...field}
                      className="bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <FormMessage className="text-red-600" />
                    <span
                      className={`text-sm ${
                        isOverLimit
                          ? "text-red-600 font-semibold"
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
                  <FormLabel className="text-gray-700 font-medium">
                    Contenido
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe el contenido de la noticia ..."
                      {...field}
                      className="bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <FormMessage className="text-red-600" />
                    <span
                      className={`text-sm ${
                        isOverLimit
                          ? "text-red-600 font-semibold"
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
                <FormLabel className="text-gray-700 font-medium">
                  Tipo de Noticia (Opcional)
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500">
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
                <FormLabel className="text-gray-700 font-medium">
                  Imagen
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    id="fileInput"
                    accept="image/*"
                    className="bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                {fileError && (
                  <p className="text-red-600 text-sm mt-1">{fileError}</p>
                )}
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedFile.name}
                  </p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2 font-medium">
                      Vista previa:
                    </p>
                    <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Vista previa de la imagen"
                        className="max-w-full h-auto max-h-64 rounded-md mx-auto block object-contain"
                      />
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Enviando..." : "Añadir Noticia"}
            </Button>
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-blue-600 font-medium">Enviando noticia...</p>
              </div>
            </div>
          )}
        </form>
      </Form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">¡Noticia creada!</h3>
            <p className="mb-4">
              La noticia ha sido creada y guardada correctamente.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
