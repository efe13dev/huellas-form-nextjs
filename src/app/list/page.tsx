'use client';
import { useEffect, useState } from 'react';
import { AnimalType } from '@/types';
import AnimalTable from '@/components/AnimalTable';

function ListPage() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/adoption');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnimals(data); // Actualiza el estado animals con los datos recibidos
      } catch (error) {
        //eslint-disable-next-line
        console.error('Error fetching adoptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='text-center text-xl pt-20 font-semibold'>Cargando...</div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        Listado de Animales
      </h1>

      <AnimalTable animals={animals} />
    </div>
  );
}

export default ListPage;
