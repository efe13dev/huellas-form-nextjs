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
        setAnimals(data);
      } catch (error) {
        //eslint-disable-next-line
        console.error('Error fetching adoptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar?');

    if (isConfirmed) {
      try {
        const response = await fetch(`/api/adoption/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id })
        });

        if (response.ok) {
          setAnimals((prevAnimals) =>
            prevAnimals.filter((animal) => animal.id !== id)
          );
          alert('Eliminado correctamente');
        } else {
          // eslint-disable-next-line
          console.error('Failed to delete animal:', response.statusText);
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error('Error deleting animal:', error);
      }
    }
  };

  const handleUpdate = async (id: string, adopted: boolean) => {
    try {
      const response = await fetch(`/api/adoption/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adopted: adopted,
          id: id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update adopted status');
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error updating adopted status:', error);
    }
  };

  if (loading) {
    return (
      <div className='text-center text-xl pt-20 font-semibold'>Cargando...</div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center '>
        Listado de Animales
      </h1>

      <AnimalTable
        animals={animals}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default ListPage;
