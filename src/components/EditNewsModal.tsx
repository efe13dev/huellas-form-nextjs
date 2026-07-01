"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NewsType } from "@/types";

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

interface EditNewsModalProps {
  news: NewsType;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: Partial<NewsType>) => Promise<void>;
}

const newsTypeValues = [
  "none",
  "urgente",
  "perdido",
  "encontrado",
  "adopcion",
  "evento",
  "noticia",
  "salud",
] as const;

const normalizeNewsType = (type?: string) => {
  const normalized = type
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return newsTypeValues.includes(normalized as (typeof newsTypeValues)[number])
    ? (normalized as (typeof newsTypeValues)[number])
    : "none";
};

const editNewsSchema = z.object({
  title: z.string().min(2, "El titulo debe tener al menos 2 caracteres").max(100),
  content: z.string().min(2, "El contenido debe tener al menos 2 caracteres").max(5000),
  type: z.enum(newsTypeValues),
});

type EditNewsValues = z.infer<typeof editNewsSchema>;

const EditNewsModal: React.FC<EditNewsModalProps> = ({ news, onClose, onUpdate }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditNewsValues>({
    resolver: zodResolver(editNewsSchema),
    defaultValues: {
      title: news.title,
      content: news.content,
      type: normalizeNewsType(news.type),
    },
  });

  const onSubmit = (values: EditNewsValues) => {
    startTransition(async () => {
      await onUpdate(news.id, {
        title: values.title,
        content: values.content,
        type: values.type === "none" ? "" : values.type,
      });
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Editar noticia</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-[calc(90vh-52px)] overflow-y-auto"
          >
            <div className="grid gap-4 p-5 lg:grid-cols-[180px_1fr]">
              {/* Image preview */}
              <div>
                {news.image ? (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <span className="text-xs">Sin imagen</span>
                  </div>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  La imagen no se modifica desde aqui.
                </p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Titulo</FormLabel>
                      <FormControl>
                        <Input placeholder="Titulo de la noticia" {...field} />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormMessage />
                        <span className="ml-auto text-xs text-muted-foreground">
                          {field.value.length}/100
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
                        <Textarea placeholder="Contenido de la noticia" rows={6} {...field} />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormMessage />
                        <span className="ml-auto text-xs text-muted-foreground">
                          {field.value.length}/5000
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
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sin tipo</SelectItem>
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

            <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isPending}
              >
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
  );
};

export default EditNewsModal;
