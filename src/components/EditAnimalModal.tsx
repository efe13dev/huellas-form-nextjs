import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimalType } from '@/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditAnimalModalProps {
  animal: AnimalType;
  onClose: () => void;
  onUpdate: (updatedAnimal: AnimalType) => Promise<void>;
}

const EditAnimalModal: React.FC<EditAnimalModalProps> = ({
  animal,
  onClose,
  onUpdate
}) => {
  const [editedAnimal, setEditedAnimal] = useState<AnimalType>(animal);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 500) {
      return; // No actualizar si excede 500 caracteres
    }
    setEditedAnimal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(editedAnimal);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev > 0 ? prev - 1 : (editedAnimal.photos?.length ?? 0) - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev < (editedAnimal.photos?.length ?? 0) - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative transform transition-all duration-300 ease-out'>
        <div className='sticky top-0 bg-white z-10 p-4 border-b border-gray-100 flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-800'>Editar Animal</h2>
          <button
            onClick={onClose}
            className='p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            aria-label='Cerrar'
          >
            <X className='h-6 w-6' />
          </button>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
              {editedAnimal.photos && editedAnimal.photos.length > 0 ? (
                <div className='relative h-[300px] sm:h-[400px] lg:h-[500px] bg-white rounded-lg overflow-hidden shadow-sm'>
                  <img
                    src={editedAnimal.photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1} de ${editedAnimal.name}`}
                    className='w-full h-full object-contain p-4'
                  />
                  {editedAnimal.photos.length > 1 && (
                    <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-4'>
                      <Button
                        onClick={handlePrevPhoto}
                        variant='outline'
                        size='icon'
                        className='bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200'
                      >
                        <ChevronLeft className='h-5 w-5' />
                      </Button>
                      <Button
                        onClick={handleNextPhoto}
                        variant='outline'
                        size='icon'
                        className='bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200'
                      >
                        <ChevronRight className='h-5 w-5' />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400'>
                  <span className='text-5xl mb-2'>📷</span>
                  <p className='text-lg font-medium'>No hay fotos disponibles</p>
                </div>
              )}
            </div>
            <div className='space-y-6'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-1'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Nombre
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={editedAnimal.name}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out'
                  />
                </div>
                <div className='space-y-1'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Descripción
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    value={editedAnimal.description}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out min-h-[120px] resize-y'
                    rows={5}
                    maxLength={500}
                  />
                  <p className='text-xs text-gray-500 mt-1 text-right'>
                    {editedAnimal.description.length}/500 caracteres
                  </p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label
                      htmlFor='type'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Tipo
                    </label>
                    <select
                      id='type'
                      name='type'
                      value={editedAnimal.type}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white'
                    >
                      <option value='dog'>Perro</option>
                      <option value='cat'>Gato</option>
                      <option value='other'>Otro</option>
                    </select>
                  </div>
                  <div className='space-y-1'>
                    <label
                      htmlFor='age'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Edad
                    </label>
                    <select
                      id='age'
                      name='age'
                      value={editedAnimal.age}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white'
                    >
                      <option value='puppy'>Cachorro</option>
                      <option value='young'>Joven</option>
                      <option value='adult'>Adulto</option>
                      <option value='senior'>Anciano</option>
                    </select>
                  </div>
                  <div className='space-y-1'>
                    <label
                      htmlFor='genre'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Género
                    </label>
                    <select
                      id='genre'
                      name='genre'
                      value={editedAnimal.genre}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white'
                    >
                      <option value='unknown'>Desconocido</option>
                      <option value='male'>Macho</option>
                      <option value='female'>Hembra</option>
                    </select>
                  </div>
                  <div className='space-y-1'>
                    <label
                      htmlFor='size'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Tamaño
                    </label>
                    <select
                      id='size'
                      name='size'
                      value={editedAnimal.size}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white'
                    >
                      <option value='small'>Pequeño</option>
                      <option value='medium'>Mediano</option>
                      <option value='big'>Grande</option>
                    </select>
                  </div>
                </div>
                
                <div className='pt-4 border-t border-gray-100'>
                  <div className='flex justify-end space-x-3'>
                    <Button
                      type='button'
                      onClick={onClose}
                      variant='outline'
                      className='px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm rounded-lg transition-colors duration-150'
                    >
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      className='px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg shadow-sm transition-colors duration-150'
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
}

export default EditAnimalModal;
