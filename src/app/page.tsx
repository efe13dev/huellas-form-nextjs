"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
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

const MAX_FILES = 5;

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  age: z.enum(["puppy", "young", "adult", "senior"]),
  type: z.enum(["dog", "cat", "other"]),
  size: z.enum(["small", "medium", "big"]),
  photos: z.array(z.string()).optional(),
  genre: z.enum(["male", "female", "unknown"]).default("unknown"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

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

    return { url: data.url };
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsLoading(true);

      try {
        const { name, description, age, type, size, genre } = values;

        const photoUrls = await Promise.all(selectedFiles.map((file) => uploadToCloudinary(file)));

        const adoptionData: TursoData = {
          name,
          description,
          age,
          type,
          size,
          genre,
          photos: photoUrls.map((data) => data.url),
        };

        const response = await fetch("/api/adoption", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adoptionData),
        });

        const result = await response.json();

        if (response.ok) {
          // eslint-disable-next-line no-console
          console.log("Adoption inserted successfully:", result);
          form.reset();
          setSelectedFiles([]);
          setShowConfirmation(true);
        } else {
          console.error("Error inserting adoption:", result.error);
        }
      } catch (error) {
        console.error("Error inserting adoption:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [form, selectedFiles, uploadToCloudinary],
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > MAX_FILES) {
      setFileError(`Solo se pueden subir un máximo de ${MAX_FILES} imágenes.`);
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files);
      setFileError(null);
    }
  }, []);

  const isFormValid = form.formState.isValid && selectedFiles.length <= MAX_FILES && !fileError;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-4 max-w-2xl space-y-6 rounded-lg bg-white px-4 py-8 shadow-md"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Registro de Animal en Adopción
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Registra nuevos animales en el sistema para que estén disponibles para adopción
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introduce un nombre ..."
                    {...field}
                    className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuenta su historia ..."
                    {...field}
                    className="min-h-[150px] rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">Edad</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Selecciona una edad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="puppy">Cachorro</SelectItem>
                      <SelectItem value="young">Adulto joven</SelectItem>
                      <SelectItem value="adult">Adulto</SelectItem>
                      <SelectItem value="senior">Anciano</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">Tipo</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Elige un animal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dog">Perro</SelectItem>
                      <SelectItem value="cat">Gato</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">Tamaño</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Selecciona un tamaño" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="big">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">Género</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Selecciona un género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unknown">Desconocido</SelectItem>
                      <SelectItem value="male">Macho</SelectItem>
                      <SelectItem value="female">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">Imágenes (máximo 5)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    id="fileInput"
                    accept="image/*"
                    className="rounded-md border border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedFiles.length} imagen(es) seleccionada(s)
                  </p>
                )}
              </FormItem>
            )}
          />

          <Button
            className="w-full transform rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Enviando..." : "Añadir"}
          </Button>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          )}
        </form>
      </Form>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <h3 className="mb-4 text-xl font-bold">¡Registro exitoso!</h3>
            <p className="mb-4">El animal ha sido registrado correctamente para adopción.</p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  window.location.reload();
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
