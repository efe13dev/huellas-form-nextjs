import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { AnimalType } from "@/types";

import { Button } from "@/components/ui/button";

interface EditAnimalModalProps {
  animal: AnimalType;
  onClose: () => void;
  onUpdate: (updatedAnimal: AnimalType) => Promise<void>;
}

const EditAnimalModal: React.FC<EditAnimalModalProps> = ({ animal, onClose, onUpdate }) => {
  const [editedAnimal, setEditedAnimal] = useState<AnimalType>(animal);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "description" && value.length > 500) {
      return; // No actualizar si excede 500 caracteres
    }
    setEditedAnimal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(editedAnimal);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : (editedAnimal.photos?.length ?? 0) - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < (editedAnimal.photos?.length ?? 0) - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200 animate-in fade-in">
      <div className="relative max-h-[95vh] w-full max-w-6xl transform overflow-y-auto rounded-xl bg-white shadow-2xl transition-all duration-300 ease-out">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-4">
          <h2 className="text-2xl font-bold text-gray-800">Editar Animal</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              {editedAnimal.photos && editedAnimal.photos.length > 0 ? (
                <div className="relative h-[300px] overflow-hidden rounded-lg bg-white shadow-sm sm:h-[400px] lg:h-[500px]">
                  <img
                    src={editedAnimal.photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1} de ${editedAnimal.name}`}
                    className="h-full w-full object-contain p-4"
                  />
                  {editedAnimal.photos.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <Button
                        onClick={handlePrevPhoto}
                        variant="outline"
                        size="icon"
                        className="bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={handleNextPhoto}
                        variant="outline"
                        size="icon"
                        className="bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 sm:h-[400px] lg:h-[500px]">
                  <span className="mb-2 text-5xl">📷</span>
                  <p className="text-lg font-medium">No hay fotos disponibles</p>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedAnimal.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedAnimal.description}
                    onChange={handleInputChange}
                    className="min-h-[120px] w-full resize-y rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    rows={5}
                    maxLength={500}
                  />
                  <p className="mt-1 text-right text-xs text-gray-500">
                    {editedAnimal.description.length}/500 caracteres
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={editedAnimal.type}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="dog">Perro</option>
                      <option value="cat">Gato</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Edad
                    </label>
                    <select
                      id="age"
                      name="age"
                      value={editedAnimal.age}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="puppy">Cachorro</option>
                      <option value="young">Joven</option>
                      <option value="adult">Adulto</option>
                      <option value="senior">Anciano</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                      Género
                    </label>
                    <select
                      id="genre"
                      name="genre"
                      value={editedAnimal.genre}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="unknown">Desconocido</option>
                      <option value="male">Macho</option>
                      <option value="female">Hembra</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                      Tamaño
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={editedAnimal.size}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="big">Grande</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="rounded-lg border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnimalModal;
