'use client';

import { redirect, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { IconBrandGoogle } from '@tabler/icons-react';

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    return redirect('/');
  }
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('google', {
      callbackUrl: '/'
    });
    if (result?.ok) {
      router.push('/');
    } else {
      console.error('Error during sign-in');
    }
  };
  return (
      <div className="h-screen bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h1>
          <p className="text-gray-600 mb-6">Click below to login with Google:</p>
          <form onSubmit={handleSubmit}>
            <button
              className="flex items-center justify-center border px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition"
              type="submit"
            >
              <IconBrandGoogle className="w-6 h-6 mr-2" />
              Login with Google
            </button>
          </form>
        </div>
      </div>
  );
}
