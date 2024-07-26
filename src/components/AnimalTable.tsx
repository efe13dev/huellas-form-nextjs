import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  const [localAnimals, setLocalAnimals] = useState(animals);
  console.log(JSON.parse(localAnimals[0].photos));

  const handleAdoptedChange = async (id: string, adopted: boolean) => {
    try {
      await onUpdate(id, adopted);
      setLocalAnimals((prevAnimals) =>
        prevAnimals.map((animal) =>
          animal.id === id ? { ...animal, adopted } : animal
        )
      );
    } catch (error) {
      // eslint-disable-next-line
      console.error('Failed to update adopted status:', error);
    }
  };

  return (
    <table className='min-w-full bg-white border border-gray-300'>
      <thead>
        <tr className='bg-gray-200'>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>
            Imagen
          </th>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>
            Nombre
          </th>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>Edad</th>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>Tipo</th>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>
            Fecha de registro
          </th>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>
            Adoptado
          </th>
          <th className='py-2 px-4 border-b border-gray-300 text-left'>
            Eliminar
          </th>
        </tr>
      </thead>
      <tbody>
        {localAnimals.map((animal) => (
          <tr
            key={animal.id}
            className='even:bg-gray-600 odd:bg-gray-400'
          >
            <td className='py-2 px-4 border-b border-gray-300'>
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img
                src={animal.photos ? animal.photos[0] : '/default-image.jpg'}
                alt={animal.name}
                className='w-10 h-12 object-cover'
              />
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>
              {animal.name}
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>
              {animal.age === 'puppy' && 'Cachorro'}
              {animal.age === 'young' && 'Joven'}
              {animal.age === 'adult' && 'Adulto'}
              {animal.age === 'senior' && 'Anciano'}
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>
              {animal.type === 'dog' && 'Perro'}
              {animal.type === 'cat' && 'Gato'}
              {animal.type === 'other' && 'Otro'}
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>
              {animal.register_date}
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>
              <input
                type='checkbox'
                checked={!!animal.adopted}
                onChange={(e) =>
                  handleAdoptedChange(animal.id, e.target.checked)
                }
              />
            </td>
            <td className='py-2 px-2 border-b border-gray-300 text-left'>
              <Button
                className='bg-red-900'
                onClick={() => onDelete(animal.id)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnimalTable;
