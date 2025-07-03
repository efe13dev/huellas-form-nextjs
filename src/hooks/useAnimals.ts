'use client';
import { useState, useEffect, useCallback } from 'react';
import { AnimalType } from '@/types';
import {
  fetchAnimals,
  deleteAnimal,
  updateAnimal
} from '../app/services/animalService';
import { deleteImageFromCloudinary } from '../app/services/cloudinaryService';
import extractIdFromUrl from '@/utils/extractIdFromUrl';

export function useAnimals() {
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
        setError(
          'Error al cargar la lista de animales. Por favor, inténtalo de nuevo más tarde.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteAnimal = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('Error: no hay ID para eliminar');
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
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error al eliminar el animal:', error);
      alert('Hubo un error al eliminar el animal');
      throw error;
    }
  }, []);

  const handleUpdateAnimal = useCallback(
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

  return {
    animals,
    loading,
    error,
    handleDeleteAnimal,
    handleUpdateAnimal
  };
}
