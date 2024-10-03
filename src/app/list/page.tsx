'use client';
import { useEffect, useState } from 'react';
import { AnimalType } from '@/types';
import AnimalTable from '@/components/AnimalTable';
import extractIdFromUrl from '@/utils/extractIdFromUrl';

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
        // eslint-disable-next-line
        console.error('Error fetching adoptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function deleteToCloudinary(id: string | number) {
    if (!id) {
      throw new Error(`Error: identificador no valido`);
    }

    const response = await fetch('/api/cloudinary', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_id: id.toString() })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.error}`);
    }

    const data = await response.json();
    return data;
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      throw new Error(`Error: no hay que borrar nada`);
    }

    try {
      // Obtener datos del animal
      const responseDataImages = await fetch(`/api/adoption/${id}`);
      if (!responseDataImages.ok) {
        throw new Error('No se pudo obtener la información del animal');
      }
      const data = await responseDataImages.json();

      // Procesar fotos
      const photos: string[] =
        typeof data.photos === 'string' ? JSON.parse(data.photos) : [];

      // Eliminar fotos de Cloudinary
      await Promise.all(
        photos.map((photo) => deleteToCloudinary(extractIdFromUrl(photo)))
      );

      // Eliminar animal de la base de datos
      const response = await fetch(`/api/adoption/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el animal de la base de datos');
      }

      return true; // Indicar que la eliminación fue exitosa
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error al eliminar el animal:', error);
      alert('Hubo un error al eliminar el animal');
      return false; // Indicar que la eliminación falló
    }
  };

  const handleUpdate = async (
    id: string,
    updatedFields: Partial<AnimalType>
  ) => {
    try {
      if (!id) {
        throw new Error(`Error: no hay ID para actualizar`);
      }

      const response = await fetch(`/api/adoption/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          ...updatedFields
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos del animal');
      }

      // Actualizar el estado local
      setAnimals(
        animals.map((animal) =>
          animal.id === id ? { ...animal, ...updatedFields } : animal
        )
      );
    } catch (error) {
      console.error('Error al actualizar los datos del animal:', error);
      alert('Hubo un error al actualizar los datos del animal');
    }
  };

  if (loading) {
    return (
      <div className='text-center text-xl pt-20 font-semibold'>Cargando...</div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center text-slate-600'>
        Listado de Animales
      </h1>

      <AnimalTable
        animals={animals}
        onDelete={(id) => handleDelete(id).then(() => {})}
        onUpdate={(animalData: AnimalType) =>
          handleUpdate(animalData.id, animalData).then(() => {})
        }
      />
    </div>
  );
}

export default ListPage;
