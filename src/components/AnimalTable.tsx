import { Button } from '@/components/ui/button';
import { AnimalType } from '@/types';

const AnimalTable = ({ animals }: { animals: AnimalType[] }) => {
  return (
    <table className='min-w-full bg-white border border-gray-300'>
      <thead>
        <tr className='bg-gray-200'>
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
        {animals.map((animal, index) => (
          <tr
            key={index}
            className='even:bg-gray-600 odd:bg-gray-400'
          >
            <td className='py-2 px-4 border-b border-gray-300'>
              {animal.name}
            </td>
            <td className='py-2 px-4 border-b border-gray-300'>
              {animal.age === 'puppy' && 'cachorro'}
              {animal.age === 'young' && 'joven'}
              {animal.age === 'adult' && 'adulto'}
              {animal.age === 'senior' && 'anciano'}
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
                readOnly
              />
            </td>
            <td className='py-2 px-2 border-b border-gray-300 text-left'>
              <Button className='bg-red-900'>Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnimalTable;
