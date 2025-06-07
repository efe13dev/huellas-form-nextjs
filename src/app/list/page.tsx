'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals()
      .then((result) => {
        if (!result || (Array.isArray(result) && result.length === 0)) {
          setError('No se encontraron animales en la base de datos.');
          setAnimals([]);
        } else {
          setAnimals(Array.isArray(result) ? result : [result]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Error al cargar la lista de animales. Por favor, inténtalo de nuevo más tarde.');
      })
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

  if (status === 'loading' || loading) {
    return (
      <div className='text-center text-xl pt-20 font-semibold'>Cargando...</div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-600 text-lg pt-20 font-semibold'>
        {error}
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
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
