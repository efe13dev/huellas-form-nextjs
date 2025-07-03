'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnimalType } from '@/types';
import AnimalTable from '@/components/AnimalTable';
import { useAnimals } from '@/hooks/useAnimals';

function ListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { animals, loading, error, handleDeleteAnimal, handleUpdateAnimal } = useAnimals();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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
        onDelete={handleDeleteAnimal}
        onUpdate={(animalData: AnimalType) =>
          handleUpdateAnimal(animalData.id, animalData)
        }
      />
    </div>
  );
}

export default ListPage;
