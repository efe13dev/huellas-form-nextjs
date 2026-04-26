"use client";
import { ImageIcon, Loader2, Newspaper, Save, X } from "lucide-react";
import React, { useState } from "react";

import { NewsType } from "@/types";

import { Button } from "@/components/ui/button";
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
  "urgente",
  "perdido",
  "encontrado",
  "adopcion",
  "evento",
  "noticia",
  "salud",
] as const;

type NewsTypeValue = (typeof newsTypeValues)[number];

const normalizeNewsType = (type?: string) => {
  const normalizedType = type
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return newsTypeValues.includes(normalizedType as NewsTypeValue) ? normalizedType : "none";
};

const EditNewsModal: React.FC<EditNewsModalProps> = ({ news, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: news.title,
    content: news.content,
    type: normalizeNewsType(news.type),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length < 2) {
      newErrors.title = "El título debe tener al menos 2 caracteres";
    } else if (formData.title.length > 100) {
      newErrors.title = "El título no puede exceder 100 caracteres";
    }

    if (!formData.content.trim()) {
      newErrors.content = "El contenido es requerido";
    } else if (formData.content.length < 2) {
      newErrors.content = "El contenido debe tener al menos 2 caracteres";
    } else if (formData.content.length > 5000) {
      newErrors.content = "El contenido no puede exceder 5000 caracteres";
    }

    if (formData.type && formData.type.length > 50) {
      newErrors.type = "El tipo no puede exceder 50 caracteres";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onUpdate(news.id, {
        title: formData.title,
        content: formData.content,
        type: formData.type === "none" ? "" : formData.type,
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar la noticia:", error);
      alert("Error al actualizar la noticia. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-white/20">
        <div className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-6 text-slate-950 sm:px-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Newspaper className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Editar noticia</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Actualiza el contenido editorial sin modificar la imagen destacada.
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-950"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(92vh-112px)] overflow-y-auto">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {news.image ? (
                  <img src={news.image} alt={news.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-slate-400">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Imagen actual
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    La imagen no se modifica desde este formulario.
                  </p>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Título *</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-blue-500 focus:bg-white focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : ""
                  }`}
                  placeholder="Título de la noticia"
                />
                <div className="mt-2 flex items-center justify-between gap-4">
                  {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                  <span className="ml-auto text-xs font-medium text-slate-400">
                    {formData.title.length}/100
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Contenido *
                </label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={`min-h-[240px] rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-blue-500 focus:bg-white focus:ring-blue-500 ${
                    errors.content ? "border-red-500" : ""
                  }`}
                  placeholder="Contenido de la noticia"
                />
                <div className="mt-2 flex items-center justify-between gap-4">
                  {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                  <span className="ml-auto text-xs font-medium text-slate-400">
                    {formData.content.length}/5000
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Tipo</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, type: value }));
                    if (errors.type) {
                      setErrors((prev) => ({ ...prev, type: "" }));
                    }
                  }}
                >
                  <SelectTrigger
                    className={`h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none focus:border-blue-500 focus:ring-blue-500 ${
                      errors.type ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Selecciona el tipo de noticia (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin tipo</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                    <SelectItem value="encontrado">Encontrado</SelectItem>
                    <SelectItem value="adopcion">Adopción</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="noticia">Noticia</SelectItem>
                    <SelectItem value="salud">Salud</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="h-11 rounded-xl px-5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-xl bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewsModal;
