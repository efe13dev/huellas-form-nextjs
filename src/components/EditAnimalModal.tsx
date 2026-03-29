import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, ChevronLeft, ChevronRight, Loader2, ImageIcon } from "lucide-react";

import { AnimalType } from "@/types";

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

const editFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  description: z.string().min(2).max(500),
  age: z.enum(["puppy", "young", "adult", "senior"]),
  type: z.enum(["dog", "cat", "other"]),
  size: z.enum(["small", "medium", "big"]),
  genre: z.enum(["male", "female", "unknown"]),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface EditAnimalModalProps {
  animal: AnimalType;
  onClose: () => void;
  onUpdate: (updatedAnimal: AnimalType) => Promise<void>;
}

const EditAnimalModal: React.FC<EditAnimalModalProps> = ({
  animal,
  onClose,
  onUpdate,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: animal.name,
      description: animal.description,
      age: animal.age as EditFormValues["age"],
      type: animal.type as EditFormValues["type"],
      size: animal.size as EditFormValues["size"],
      genre: animal.genre as EditFormValues["genre"],
    },
  });

  const photos = Array.isArray(animal.photos) ? animal.photos : [];

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const onSubmit = (values: EditFormValues) => {
    startTransition(async () => {
      await onUpdate({ ...animal, ...values });
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-5xl transform overflow-y-auto rounded-2xl bg-white shadow-2xl duration-200 animate-in fade-in zoom-in-95">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-800">Editar Animal</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              {photos.length > 0 ? (
                <div className="relative h-[300px] overflow-hidden rounded-lg bg-white sm:h-[400px] lg:h-[480px]">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1} de ${animal.name}`}
                    className="h-full w-full object-contain p-4"
                  />
                  {photos.length > 1 && (
                    <>
                      <Button
                        onClick={handlePrevPhoto}
                        variant="outline"
                        size="icon"
                        className="absolute bottom-4 left-4 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-500">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                      <Button
                        onClick={handleNextPhoto}
                        variant="outline"
                        size="icon"
                        className="absolute bottom-4 right-4 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg bg-gray-100 sm:h-[400px] lg:h-[480px]">
                  <ImageIcon className="mb-2 h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-400">
                    No hay fotos disponibles
                  </p>
                </div>
              )}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del animal" {...field} />
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
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cuenta su historia..."
                          className="min-h-[120px] resize-y"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormMessage />
                        <p className="text-xs text-gray-400">
                          {field.value.length}/500
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
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
                        <FormLabel>Edad</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
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
                        <FormLabel>Género</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                        <FormLabel>Tamaño</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
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

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending} className="gap-2">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnimalModal;
