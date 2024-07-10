import Link from 'next/link';
import { Button } from './ui/button';

export const Header = () => {
  return (
    <header className=' mx-32 pt-10'>
      <h1 className=' flex flex-row justify-center text-6xl font-semibold font-serif drop-shadow-lg'>
        Fido
      </h1>
      <nav className='flex justify-end gap-6'>
        <Link href={'./'}>
          <Button
            variant={'link'}
            className='text-base'
          >
            Añadir nuevo
          </Button>
        </Link>
        <Link href={'./list'}>
          <Button
            variant={'link'}
            className='text-base'
          >
            Lista de animales
          </Button>
        </Link>
      </nav>
    </header>
  );
};
