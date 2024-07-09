import Link from 'next/link';
export const Header = () => {
  return (
    <header className=' mx-32 pt-10'>
      <h1 className=' flex flex-row justify-center text-6xl font-semibold font-serif drop-shadow-lg'>
        Fido
      </h1>
      <nav className='flex justify-end gap-6'>
        <Link href={'./'}>Añadir</Link>
        <Link href={'./list'}>Lista de animales</Link>
      </nav>
    </header>
  );
};
