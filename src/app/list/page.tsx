'use client';
import { useEffect, useState, useCallback } from 'react';
import { AnimalType } from '@/types';
import AnimalTable from '@/components/AnimalTable';
import extractIdFromUrl from '@/utils/extractIdFromUrl';
import {
  fetchAnimals,
  deleteAnimal,
  updateAnimal
} from '../services/animalService';
import { deleteImageFromCloudinary } from '../services/cloudinaryService';

function ListPage() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals()
      .then((result) =>
        Array.isArray(result) ? setAnimals(result) : setAnimals([result])
      )
      .catch(
        // eslint-disable-next-line
        console.error
      )
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!id) {
      throw new Error('Error: no hay que borrar nada');
    }

    try {
      const animalData = await fetchAnimals(id);
      const animal = Array.isArray(animalData) ? animalData[0] : animalData;
      const photos: string[] = JSON.parse(
        typeof animal.photos === 'string' ? animal.photos : '[]'
      );

      await Promise.all(
        photos.map((photo) =>
          deleteImageFromCloudinary(extractIdFromUrl(photo))
        )
      );

      await deleteAnimal(id);
      setAnimals((prevAnimals) =>
        prevAnimals.filter((animal) => animal.id !== id)
      );
      return true;
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error al eliminar el animal:', error);
      alert('Hubo un error al eliminar el animal');
      return false;
    }
  }, []);

  const handleUpdate = useCallback(
    async (id: string, updatedFields: Partial<AnimalType>) => {
      try {
        await updateAnimal(id, updatedFields);
        setAnimals((prevAnimals) =>
          prevAnimals.map((animal) =>
            animal.id === id ? { ...animal, ...updatedFields } : animal
          )
        );
      } catch (error) {
        // eslint-disable-next-line
        console.error('Error al actualizar los datos del animal:', error);
        alert('Hubo un error al actualizar los datos del animal');
      }
    },
    []
  );

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
        onDelete={async (id: string) => {
          await handleDelete(id);
        }}
        onUpdate={(animalData: AnimalType) =>
          handleUpdate(animalData.id, animalData)
        }
      />
    </div>
  );
}

export default ListPage;
