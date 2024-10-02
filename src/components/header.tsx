import Link from 'next/link';
import { Button } from './ui/button';

export const Header = () => {
  return (
    <header className='mx-4 sm:mx-8 md:mx-16 lg:mx-32 pt-6 sm:pt-10'>
      <h1 className='text-center text-4xl sm:text-5xl md:text-6xl font-semibold font-serif text-gray-800 mb-4 sm:mb-6'>
        Fido
      </h1>
      <nav className='flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-6'>
        <Link href={'./'}>
          <Button
            variant={'ghost'}
            className='w-full sm:w-auto text-sm sm:text-base text-gray-800 hover:text-white hover:bg-gray-800 transition-colors duration-300'
          >
            Añadir nuevo
          </Button>
        </Link>
        <Link href={'./list'}>
          <Button
            variant={'ghost'}
            className='w-full sm:w-auto text-sm sm:text-base text-gray-800 hover:text-white hover:bg-gray-800 transition-colors duration-300'
          >
            Lista de animales
          </Button>
        </Link>
      </nav>
    </header>
  );
};
