import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ImageIcon,
  Tag,
} from "lucide-react";

import { AnimalType } from "@/types";
import { typeIcons, typeLabels } from "@/lib/labels";

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
  const animalType = animal.type as string;

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
      <div className="relative max-h-[90vh] w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-gray-900">Editar</h2>
            <span className="text-gray-300">&middot;</span>
            <span className="text-lg font-bold text-gray-900">
              {animal.name}
            </span>
            <span className="text-base">
              {typeIcons[animalType] ?? "\ud83d\udc3e"}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                animal.adopted
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {animal.adopted ? "Adoptado" : "Disponible"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(90vh-52px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Photo section — 7 cols */}
            <div className="border-b border-gray-100 p-5 lg:col-span-7 lg:border-b-0 lg:border-r">
              {photos.length > 0 ? (
                <div className="relative mx-auto flex h-[280px] items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-[340px]">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1} de ${animal.name}`}
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />

                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {photos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPhotoIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === currentPhotoIndex
                                ? "w-4 bg-gray-800"
                                : "w-1.5 bg-gray-300 hover:bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 sm:h-[340px]">
                  <ImageIcon className="mb-2 h-10 w-10 text-gray-300" />
                  <p className="text-sm text-gray-400">
                    No hay fotos disponibles
                  </p>
                </div>
              )}
            </div>

            {/* Form section — 5 cols */}
            <div className="p-5 lg:col-span-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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

                  {/* Detalles */}
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
                                <SelectItem value="unknown">
                                  Desconocido
                                </SelectItem>
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

                  {/* Footer buttons */}
                  <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="text-gray-500"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="gap-2 bg-gray-900 text-white hover:bg-gray-800"
                    >
                      {isPending && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      {isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnimalModal;
