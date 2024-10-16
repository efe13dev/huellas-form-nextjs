import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimalType } from '@/types';

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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white p-4 sm:p-8 rounded-lg max-w-7xl w-full max-h-[98vh] overflow-y-auto relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
          aria-label='Cerrar'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/2'>
            {editedAnimal.photos && editedAnimal.photos.length > 0 ? (
              <div className='relative h-[300px] sm:h-[400px] lg:h-[600px]'>
                <img
                  src={editedAnimal.photos[currentPhotoIndex]}
                  alt={`Foto ${currentPhotoIndex + 1} de ${editedAnimal.name}`}
                  className='w-full h-full object-contain rounded'
                />
                {editedAnimal.photos.length > 1 && (
                  <div className='absolute bottom-0 left-0 right-0 flex justify-evenly p-2'>
                    <Button
                      onClick={handlePrevPhoto}
                      variant='secondary'
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={handleNextPhoto}
                      variant='secondary'
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className='w-full h-[300px] sm:h-[400px] lg:h-[600px] bg-gray-200 flex items-center justify-center rounded'>
                <p>No hay fotos disponibles</p>
              </div>
            )}
          </div>
          <div className='w-full lg:w-1/2'>
            <h2 className='text-2xl font-bold mb-4'>Editar Animal</h2>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              <div className='mb-4'>
                <label
                  htmlFor='name'
                  className='block mb-2 font-semibold text-gray-700'
                >
                  Nombre:
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={editedAnimal.name}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded'
                />
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='description'
                  className='block mb-2 font-semibold text-gray-700'
                >
                  Descripción:
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={editedAnimal.description}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded'
                  rows={12}
                  maxLength={500}
                />
                <p className='text-sm text-gray-500 mt-1'>
                  {editedAnimal.description.length}/500 caracteres
                </p>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='type'
                  className='block mb-2 font-semibold text-gray-700'
                >
                  Tipo:
                </label>
                <select
                  id='type'
                  name='type'
                  value={editedAnimal.type}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded'
                >
                  <option value='dog'>Perro</option>
                  <option value='cat'>Gato</option>
                  <option value='other'>Otro</option>
                </select>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='age'
                  className='block mb-2 font-semibold text-gray-700'
                >
                  Edad:
                </label>
                <select
                  id='age'
                  name='age'
                  value={editedAnimal.age}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded'
                >
                  <option value='puppy'>Cachorro</option>
                  <option value='young'>Joven</option>
                  <option value='adult'>Adulto</option>
                  <option value='senior'>Anciano</option>
                </select>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='genre'
                  className='block mb-2 font-semibold text-gray-700'
                >
                  Género:
                </label>
                <select
                  id='genre'
                  name='genre'
                  value={editedAnimal.genre}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded'
                >
                  <option value='unknown'>Desconocido</option>
                  <option value='male'>Macho</option>
                  <option value='female'>Hembra</option>
                </select>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='size'
                  className='block mb-2 font-semibold text-gray-700'
                >
                  Tamaño:
                </label>
                <select
                  id='size'
                  name='size'
                  value={editedAnimal.size}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded'
                >
                  <option value='small'>Pequeño</option>
                  <option value='medium'>Mediano</option>
                  <option value='big'>Grande</option>
                </select>
              </div>
              <div className='flex justify-end space-x-4'>
                <Button
                  type='button'
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button type='submit'>Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnimalModal;
