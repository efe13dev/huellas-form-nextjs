"use client";
import React, { useState } from "react";
import { NewsType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditNewsModalProps {
  news: NewsType;
  onClose: () => void;
  onUpdate: (id: string, updatedFields: Partial<NewsType>) => Promise<void>;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  news,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: news.title,
    content: news.content,
    type: news.type || "none",
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
      // eslint-disable-next-line no-console
      console.error("Error al actualizar la noticia:", error);
      alert("Error al actualizar la noticia. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Editar Noticia</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full ${errors.title ? "border-red-500" : ""}`}
                placeholder="Título de la noticia"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={`w-full min-h-[200px] ${errors.content ? "border-red-500" : ""}`}
                placeholder="Contenido de la noticia"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
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
                  className={`w-full ${errors.type ? "border-red-500" : ""}`}
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
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Actualizando..." : "Actualizar Noticia"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNewsModal;
