import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import checkImageUrl from '@/utils/checkImageUrl';
import { AnimalType } from '@/types';
import EditAnimalModal from '@/components/EditAnimalModal'; // Nuevo import

interface AnimalTableProps {
  animals: AnimalType[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (animal: AnimalType) => Promise<void>; // Nueva prop
}

const AnimalTable: React.FC<AnimalTableProps> = ({
  animals,
  onDelete,
  onUpdate
}) => {
  const [localAnimals, setLocalAnimals] = useState<AnimalType[]>(animals);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<AnimalType | null>(null);

  const updateAnimalPhotos = useCallback(async (animals: AnimalType[]) => {
    const updatedAnimals = await Promise.all(
      animals.map(async (animal) => {
        if (typeof animal.photos === 'string') {
          try {
            const photos = JSON.parse(animal.photos);
            const photoUrl =
              photos.length > 0
                ? await checkImageUrl(photos[0])
                : '/default-image.jpg';
            return { ...animal, photos: [photoUrl] };
          } catch (error) {
            // eslint-disable-next-line
            console.error('Failed to parse photos JSON:', error);
            return { ...animal, photos: ['/default-image.jpg'] };
          }
        }
        return animal;
      })
    );
    setLocalAnimals(updatedAnimals);
  }, []);

  useEffect(() => {
    updateAnimalPhotos(animals);
  }, [animals, updateAnimalPhotos]);

  const handleAdoptedChange = useCallback(
    async (id: string, adopted: boolean) => {
      try {
        const response = await fetch('/api/adoption', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, adopted })
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el estado de adopción');
        }

        setLocalAnimals((prevAnimals) =>
          prevAnimals.map((animal) =>
            animal.id === id ? { ...animal, adopted } : animal
          )
        );
      } catch (error) {
        // eslint-disable-next-line
        console.error('Error al actualizar el estado de adopción:', error);
        // Revertir el cambio local si la actualización falla
        setLocalAnimals((prevAnimals) =>
          prevAnimals.map((animal) =>
            animal.id === id ? { ...animal, adopted: !adopted } : animal
          )
        );
      }
    },
    []
  );

  const handleDeleteClick = useCallback((id: string) => {
    setConfirmDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        await onDelete(confirmDelete);
        setLocalAnimals((prevAnimals) =>
          prevAnimals.filter((animal) => animal.id !== confirmDelete)
        );
        setDeleteMessage('Animal eliminado correctamente');
      } catch (error) {
        // eslint-disable-next-line
        console.error('Error al eliminar el animal:', error);
        setDeleteMessage('Error al eliminar el animal');
      } finally {
        setIsDeleting(false);
        setConfirmDelete(null);
        setTimeout(() => setDeleteMessage(''), 2000);
      }
    }
  }, [confirmDelete, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDelete(null);
  }, []);

  const handleImageClick = useCallback((animal: AnimalType) => {
    setEditingAnimal(animal);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingAnimal(null);
  }, []);

  const handleUpdateAnimal = useCallback(
    async (updatedAnimal: AnimalType) => {
      try {
        await onUpdate(updatedAnimal);
        setLocalAnimals((prevAnimals) =>
          prevAnimals.map((animal) =>
            animal.id === updatedAnimal.id ? updatedAnimal : animal
          )
        );
        setEditingAnimal(null);
      } catch (error) {
        // eslint-disable-next-line
        console.error('Error al actualizar el animal:', error);
      }
    },
    [onUpdate]
  );

  return (
    <div className='relative'>
      {(isDeleting || deleteMessage || confirmDelete) && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full mx-4'>
            {isDeleting && (
              <>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4'></div>
                <p className='text-lg font-semibold'>Eliminando animal...</p>
              </>
            )}
            {deleteMessage && (
              <p className='text-lg font-semibold'>{deleteMessage}</p>
            )}
            {confirmDelete && !isDeleting && (
              <>
                <p className='text-lg font-semibold mb-4'>
                  ¿Estás seguro de que deseas eliminar este animal?
                </p>
                <div className='flex space-x-4'>
                  <Button
                    onClick={handleConfirmDelete}
                    className='bg-red-500 hover:bg-red-600 text-white'
                    disabled={isDeleting}
                  >
                    Confirmar
                  </Button>
                  <Button
                    onClick={handleCancelDelete}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-800'
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {editingAnimal && (
        <EditAnimalModal
          animal={editingAnimal}
          onClose={handleCloseModal}
          onUpdate={handleUpdateAnimal}
        />
      )}

      <div
        className={`overflow-x-auto bg-gradient-to-br from-gray-100 to-gray-200 p-4 lg:p-8 rounded-xl shadow-2xl transition-all duration-300 ${isDeleting || confirmDelete ? 'filter blur-sm' : ''}`}
      >
        <table className='min-w-full border-collapse shadow-lg rounded-lg overflow-hidden'>
          <thead className='hidden lg:table-header-group'>
            <tr className='bg-gradient-to-r from-blue-300 to-purple-300'>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Imagen
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Nombre
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Edad
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Tipo
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Fecha de registro
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Género
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Tamaño
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Adoptado
              </th>
              <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {localAnimals.map((animal) => {
              const photoUrl =
                animal.photos &&
                animal.photos.length > 0 &&
                !animal.photos[0].includes('[')
                  ? animal.photos[0]
                  : '/loading.gif';

              return (
                <tr
                  key={animal.id}
                  className='flex flex-col lg:table-row mb-4 lg:mb-0 hover:bg-gray-100 transition-colors duration-300 ease-in-out bg-white rounded-lg shadow-md lg:shadow-none lg:rounded-none'
                >
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Imagen:</span>
                    <img
                      src={photoUrl}
                      alt={animal.name}
                      className='object-cover w-20 h-20 lg:w-28 lg:h-28 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer'
                      onClick={() => handleImageClick(animal)}
                    />
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Nombre:</span>
                    <span className='font-medium text-gray-700'>
                      {animal.name}
                    </span>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Edad:</span>
                    <span className='text-gray-600'>
                      {animal.age === 'puppy' && 'Cachorro'}
                      {animal.age === 'young' && 'Joven'}
                      {animal.age === 'adult' && 'Adulto'}
                      {animal.age === 'senior' && 'Anciano'}
                    </span>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Tipo:</span>
                    <span className='text-gray-600'>
                      {animal.type === 'dog' && 'Perro'}
                      {animal.type === 'cat' && 'Gato'}
                      {animal.type === 'other' && 'Otro'}
                    </span>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>
                      Fecha de registro:
                    </span>
                    <span className='text-gray-600'>
                      {new Date(animal.register_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Género:</span>
                    <span className='text-gray-600'>
                      {animal.genre === 'male' && 'Macho'}
                      {animal.genre === 'female' && 'Hembra'}
                      {animal.genre === 'unknown' && 'Desconocido'}
                    </span>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Tamaño:</span>
                    <span className='text-gray-600'>
                      {animal.size === 'small' && 'Pequeño'}
                      {animal.size === 'medium' && 'Mediano'}
                      {animal.size === 'big' && 'Grande'}
                    </span>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300 flex items-center justify-between lg:table-cell'>
                    <span className='lg:hidden font-semibold'>Adoptado:</span>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={animal.adopted}
                        onChange={(e) =>
                          handleAdoptedChange(animal.id, e.target.checked)
                        }
                        className='form-checkbox h-6 w-6 text-indigo-500 bg-gray-700 border-gray-300 rounded-md transition duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500'
                      />
                      <span className='lg:hidden text-gray-600'>
                        {animal.adopted ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </td>
                  <td className='py-3 lg:py-5 px-4 lg:px-6 border-b border-gray-300'>
                    <Button
                      className='bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto'
                      onClick={() => handleDeleteClick(animal.id)}
                      disabled={isDeleting || confirmDelete !== null}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimalTable;
