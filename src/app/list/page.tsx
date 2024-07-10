import { getAdoptions } from '@/db/clientTurso';
import { AnimalType } from '@/types';

async function ListPage() {
  const data = await getAdoptions();
  const animals: AnimalType[] = data.rows;
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        Listado de Animales
      </h1>
      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='py-2 px-4 border-b border-gray-300 text-left'>
              Nombre
            </th>
            <th className='py-2 px-4 border-b border-gray-300 text-left'>
              Edad
            </th>
            <th className='py-2 px-4 border-b border-gray-300 text-left'>
              Tipo
            </th>
            <th className='py-2 px-4 border-b border-gray-300 text-left'>
              Fecha de registro
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
                {animal.age}
              </td>
              <td className='py-2 px-4 border-b border-gray-300'>
                {animal.type}
              </td>
              <td className='py-2 px-4 border-b border-gray-300'>
                {animal.register_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPage;
