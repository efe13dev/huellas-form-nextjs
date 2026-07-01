import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const EditAnimalModal: React.FC<EditAnimalModalProps> = ({ animal, onClose, onUpdate }) => {
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

  const onSubmit = (values: EditFormValues) => {
    startTransition(async () => {
      await onUpdate({ ...animal, ...values });
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Editar</h2>
            <span className="text-sm text-muted-foreground">{animal.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                animal.adopted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {animal.adopted ? "Adoptado" : "Disponible"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-52px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Photo section */}
            <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
              {photos.length > 0 ? (
                <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-md bg-muted">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1} de ${animal.name}`}
                    className="max-h-full max-w-full rounded object-contain"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentPhotoIndex((p) => (p > 0 ? p - 1 : photos.length - 1))
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white/90 p-1 shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPhotoIndex((p) => (p < photos.length - 1 ? p + 1 : 0))
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/90 p-1 shadow-sm"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                        {photos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPhotoIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === currentPhotoIndex
                                ? "w-3 bg-foreground"
                                : "w-1.5 bg-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-[260px] items-center justify-center rounded-md border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">Sin fotos</p>
                </div>
              )}
            </div>

            {/* Form section */}
            <div className="p-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nombre</FormLabel>
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
                        <FormLabel className="text-xs">Descripcion</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Cuenta su historia..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <FormLabel className="text-xs">Edad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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

                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm" disabled={isPending}>
                      {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      {isPending ? "Guardando..." : "Guardar"}
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
