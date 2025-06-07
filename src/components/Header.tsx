'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

export const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === path || pathname === '/add-animal';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className='mx-4 sm:mx-8 md:mx-16 lg:mx-32 pt-6 sm:pt-10'>
      <div className='flex items-center justify-center mb-4 sm:mb-6'>
        <img
          src='/logo-huellas-opt.png'
          alt='logo de fido'
          className='w-16 h-16 mr-4'
        />
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-semibold font-serif text-gray-800'>
          Huellas
        </h1>
      </div>
      <h2 className='text-center text-gray-500 text-lg sm:text-xl md:text-2xl'>
        Web de gestion interna
      </h2>
      <nav className='flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-6'>
        {session && (
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-6'>
            <Link href={'./'}>
              <Button
                variant={'ghost'}
                className={`w-full sm:w-auto text-sm sm:text-base transition-colors duration-300 ${
                  isActive('/')
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Añadir nuevo
              </Button>
            </Link>
            <Link href={'./list'}>
              <Button
                variant={'ghost'}
                className={`w-full sm:w-auto text-sm sm:text-base transition-colors duration-300 ${
                  isActive('/list')
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Lista de animales
              </Button>
            </Link>
          </div>
        )}
        <div className='flex items-center gap-3'>
          {session && (
            <>
              <LogoutButton />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
