'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      className='bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out'
    >
      Cerrar sesión
    </button>
  );
}
