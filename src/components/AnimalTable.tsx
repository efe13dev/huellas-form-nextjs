import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import checkImageUrl from '@/utils/checkImageUrl';
import { AnimalType } from '@/types';

interface AnimalTableProps {
  animals: AnimalType[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, adopted: boolean) => Promise<void>;
}

const AnimalTable: React.FC<AnimalTableProps> = ({
  animals,
  onDelete,
  onUpdate
}) => {
  const [localAnimals, setLocalAnimals] = useState<AnimalType[]>(animals);

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
        await onUpdate(id, adopted);
        setLocalAnimals((prevAnimals) =>
          prevAnimals.map((animal) =>
            animal.id === id ? { ...animal, adopted } : animal
          )
        );
      } catch (error) {
        console.error('Failed to update adopted status:', error);
      }
    },
    [onUpdate]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const isConfirmed = window.confirm(
        '¿Estás seguro de que deseas eliminar?'
      );

      if (isConfirmed) {
        try {
          await onDelete(id);
          setLocalAnimals((prevAnimals) =>
            prevAnimals.filter((animal) => animal.id !== id)
          );
        } catch (error) {
          console.error('Error al eliminar el animal:', error);
        }
      }
    },
    [onDelete]
  );

  return (
    <div className='overflow-x-auto bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-xl shadow-2xl'>
      <table className='min-w-full border-collapse shadow-lg rounded-lg overflow-hidden'>
        <thead>
          <tr className='bg-gradient-to-r from-indigo-500 to-purple-500'>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Imagen
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Nombre
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Edad
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Tipo
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Fecha de registro
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Género
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
              Adoptado
            </th>
            <th className='py-4 px-6 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>
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
                className='hover:bg-gray-700 transition-colors duration-300 ease-in-out'
              >
                <td className='py-5 px-6 border-b border-gray-600'>
                  <img
                    src={photoUrl}
                    alt={animal.name}
                    className='object-cover w-28 h-28 rounded-lg shadow-md transition-transform duration-300 hover:scale-105'
                  />
                </td>
                <td className='py-5 px-6 border-b border-gray-600 font-medium text-gray-100'>
                  {animal.name}
                </td>
                <td className='py-5 px-6 border-b border-gray-600 text-gray-200'>
                  {animal.age === 'puppy' && 'Cachorro'}
                  {animal.age === 'young' && 'Joven'}
                  {animal.age === 'adult' && 'Adulto'}
                  {animal.age === 'senior' && 'Anciano'}
                </td>
                <td className='py-5 px-6 border-b border-gray-600 text-gray-200'>
                  {animal.type === 'dog' && 'Perro'}
                  {animal.type === 'cat' && 'Gato'}
                  {animal.type === 'other' && 'Otro'}
                </td>
                <td className='py-5 px-6 border-b border-gray-600 text-gray-200'>
                  {animal.register_date}
                </td>
                <td className='py-5 px-6 border-b border-gray-600 text-gray-200'>
                  {animal.genre === 'male' && 'Macho'}
                  {animal.genre === 'female' && 'Hembra'}
                  {animal.genre === 'unknown' && 'Desconocido'}
                </td>
                <td className='py-5 px-6 border-b border-gray-600'>
                  <input
                    type='checkbox'
                    checked={!!animal.adopted}
                    onChange={(e) =>
                      handleAdoptedChange(animal.id, e.target.checked)
                    }
                    className='form-checkbox h-6 w-6 text-indigo-500 bg-gray-700 border-gray-600 rounded-md transition duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500'
                  />
                </td>
                <td className='py-5 px-6 border-b border-gray-600'>
                  <Button
                    className='bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg'
                    onClick={() => handleDelete(animal.id)}
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
  );
};

export default AnimalTable;
