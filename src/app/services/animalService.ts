import { AnimalType } from '@/types';

export async function fetchAnimals(
  id?: string
): Promise<AnimalType | AnimalType[]> {
  const url = id ? `/api/adoption/${id}` : '/api/adoption';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al obtener los datos de los animales');
  }
  return response.json();
}

export async function deleteAnimal(id: string): Promise<void> {
  const response = await fetch(`/api/adoption/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el animal de la base de datos');
  }
}

export async function updateAnimal(
  id: string,
  updatedFields: Partial<AnimalType>
): Promise<void> {
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
}
