import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-zinc-900 dark:text-white">Page Not Found</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link href="/" className="mt-8">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
          Go back home
        </Button>
      </Link>
    </div>
  );
}
