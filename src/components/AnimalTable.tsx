import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import checkImageUrl from '@/utils/checkImageUrl';
import { AnimalType } from '@/types';
import EditAnimalModal from '@/components/EditAnimalModal';

type AnimalTypeKey = 'dog' | 'cat' | 'other';
type GenderKey = 'male' | 'female' | 'unknown';

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
            const photoUrls = await Promise.all(
              photos.map(async (photo: string) => await checkImageUrl(photo))
            );
            return {
              ...animal,
              photos: photoUrls.length > 0 ? photoUrls : ['/default-image.jpg']
            };
          } catch (error) {
            // eslint-disable-next-line
            console.error('Error al analizar el JSON de fotos:', error);
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
      {/* Modal de confirmación de eliminación */}
      {(isDeleting || deleteMessage || confirmDelete) && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
          <div className='bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-95 hover:scale-100'>
            {isDeleting && (
              <div className='flex flex-col items-center'>
                <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4'></div>
                <p className='text-xl font-bold text-gray-800'>Eliminando animal...</p>
                <p className='text-gray-600 mt-2'>Por favor, espera un momento</p>
              </div>
            )}
            {deleteMessage && (
              <div className='text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                  </svg>
                </div>
                <p className='text-lg font-semibold text-gray-800'>{deleteMessage}</p>
              </div>
            )}
            {confirmDelete && !isDeleting && (
              <div className='text-center'>
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'></path>
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>¿Estás seguro?</h3>
                <p className='text-gray-600 mb-6'>Esta acción no se puede deshacer. El animal será eliminado permanentemente.</p>
                <div className='flex justify-center space-x-4'>
                  <button
                    onClick={handleCancelDelete}
                    className='px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className='px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center space-x-2'
                    disabled={isDeleting}
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'></path>
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
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

      <div className={`transition-all duration-300 ${isDeleting || confirmDelete ? 'filter blur-sm' : ''}`}>


        <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-indigo-600 to-blue-600'>
                <tr>
                  <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider'>
                    Animal
                  </th>
                  <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell'>
                    Edad
                  </th>
                  <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell'>
                    Tipo
                  </th>
                  <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider hidden xl:table-cell'>
                    Registro
                  </th>
                  <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell'>
                    Género
                  </th>
                  <th scope='col' className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell'>
                    Tamaño
                  </th>
                  <th scope='col' className='px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider'>
                    Estado
                  </th>
                  <th scope='col' className='px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {localAnimals.length === 0 ? (
              <tr>
                <td className='px-6 py-12 text-center' colSpan={8}>
                  <div className='flex flex-col items-center justify-center space-y-4'>
                    <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'></path>
                    </svg>
                    <h3 className='text-lg font-medium text-gray-900'>No hay animales registrados</h3>
                    <p className='text-gray-500'>Añade un nuevo animal para comenzar</p>
                  </div>
                </td>
              </tr>
            ) : (
              localAnimals.map((animal) => {
                const photoUrls = Array.isArray(animal.photos) && animal.photos.length > 0
                  ? animal.photos
                  : ['/default-image.jpg'];

                const animalTypeIcon: Record<AnimalTypeKey, string> = {
                  dog: '🐶',
                  cat: '🐱',
                  other: '🐾'
                };

                const genderIcon: Record<GenderKey, string> = {
                  male: '♂️',
                  female: '♀️',
                  unknown: '❔'
                };

                const animalType = animal.type as AnimalTypeKey;
                const animalGender = animal.genre as GenderKey;

                return (
                  <tr 
                    key={animal.id} 
                    className={`group hover:bg-gray-50 transition-colors duration-200 ${animal.adopted ? 'bg-blue-50' : ''}`}
                  >
                    {/* Celda de información del animal */}
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-16 w-16 relative group'>
                          <img 
                            className='h-16 w-16 rounded-lg object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-shadow duration-200'
                            src={photoUrls[0] || '/default-image.jpg'} 
                            alt={animal.name}
                            onClick={() => handleImageClick(animal)}
                          />
                          <div className='absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md'>
                            <span className='text-lg'>{animalTypeIcon[animalType] || '🐾'}</span>
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='flex items-center'>
                            <h4 className='text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors'>
                              {animal.name}
                            </h4>
                            <span className='ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800'>
                              {animal.genre === 'male' ? 'Macho' : animal.genre === 'female' ? 'Hembra' : 'Desconocido'}
                            </span>
                          </div>
                          <div className='mt-1 flex flex-wrap gap-1'>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
                              {animal.age === 'puppy' && 'Cachorro'}
                              {animal.age === 'young' && 'Joven'}
                              {animal.age === 'adult' && 'Adulto'}
                              {animal.age === 'senior' && 'Anciano'}
                            </span>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                              {animal.size === 'small' && 'Pequeño'}
                              {animal.size === 'medium' && 'Mediano'}
                              {animal.size === 'big' && 'Grande'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Edad (solo escritorio) */}
                    <td className='px-6 py-4 whitespace-nowrap hidden md:table-cell'>
                      <div className='text-sm text-gray-900'>{animal.age === 'puppy' ? 'Cachorro' : 
                        animal.age === 'young' ? 'Joven' : 
                        animal.age === 'adult' ? 'Adulto' : 'Anciano'}
                      </div>
                    </td>

                    {/* Tipo (solo escritorio grande) */}
                    <td className='px-6 py-4 whitespace-nowrap hidden lg:table-cell'>
                      <div className='flex items-center'>
                        <span className='mr-2 text-lg'>{animalTypeIcon[animalType] || '🐾'}</span>
                        <span className='text-sm text-gray-900'>
                          {animal.type === 'dog' ? 'Perro' : animal.type === 'cat' ? 'Gato' : 'Otro'}
                        </span>
                      </div>
                    </td>

                    {/* Fecha de registro (solo pantallas extra grandes) */}
                    <td className='px-6 py-4 whitespace-nowrap hidden xl:table-cell'>
                      <div className='text-sm text-gray-500'>
                        {new Date(animal.register_date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Género (solo escritorio) */}
                    <td className='px-6 py-4 whitespace-nowrap hidden lg:table-cell'>
                      <div className='flex items-center'>
                        <span className='mr-1'>{genderIcon[animalGender] || '❔'}</span>
                        <span className='text-sm text-gray-900'>
                          {animal.genre === 'male' ? 'Macho' : 
                           animal.genre === 'female' ? 'Hembra' : 'Desconocido'}
                        </span>
                      </div>
                    </td>

                    {/* Tamaño (solo tablet/escritorio) */}
                    <td className='px-6 py-4 whitespace-nowrap hidden md:table-cell'>
                      <div className='text-sm text-gray-900'>
                        {animal.size === 'small' && 'Pequeño'}
                        {animal.size === 'medium' && 'Mediano'}
                        {animal.size === 'big' && 'Grande'}
                      </div>
                    </td>

                    {/* Estado de adopción */}
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input 
                          type='checkbox' 
                          className='sr-only peer' 
                          checked={animal.adopted}
                          onChange={(e) => handleAdoptedChange(animal.id, e.target.checked)}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer ${animal.adopted ? 'peer-checked:bg-green-500' : 'peer-checked:bg-gray-400'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${animal.adopted ? 'after:translate-x-5' : ''}`}>
                        </div>
                        <span className='ml-2 text-sm font-medium text-gray-700 hidden md:inline'>
                          {animal.adopted ? 'Adoptado' : 'Disponible'}
                        </span>
                      </label>
                    </td>

                    {/* Acciones */}
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex justify-end space-x-2'>
                        <button
                          onClick={() => handleImageClick(animal)}
                          className='text-indigo-600 hover:text-indigo-900 mr-2 p-1.5 rounded-full hover:bg-indigo-50 transition-colors duration-200'
                          title='Editar'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(animal.id)}
                          disabled={isDeleting || confirmDelete !== null}
                          className='text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          title='Eliminar'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalTable;
