'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {
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
    <html lang='en'>
      <body>
        <form onSubmit={handleSubmit}>
        <button
        className="border px-4 py-2 bg-ig-red text-white rounded-lg"
        type="submit">Login with google
      </button>
        </form>
      </body>
    </html>
  );
}