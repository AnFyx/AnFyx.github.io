import { IconCamera, IconHome, IconLayoutGrid, IconLogout, IconSearch, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { getSessionRole } from "@/actions";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function MobileNav() {
  const user = !['mod', 'admin'].includes(await getSessionRole());
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.1)] shadow-gray-400 dark:shadow-gray-600">
      <div className="flex text-gray-700 dark:text-gray-300 *:flex *:items-center">
        <div className="block
        shadow-md
        bg-gradient-to-b 
        from-[#FF1493] 
        via-[#00FF7F] 
        to-[#FFD700]
        w-full
        relative
        z-10 
        *:size-12
        *:flex
        *:items-center
        *:justify-center
        justify-around">
          <Link href="/">
            <IconHome/>
          </Link>
          <Link href="/search">
            <IconSearch/>
          </Link>
          {user && (
            <Link href="/create">
              <IconCamera/>
            </Link>
          )}
          <Link href="/browse">
            <IconLayoutGrid/>
          </Link>
          <Link href="/profile">
          {user && (
              <><IconUser /></>
            )}
            {!user && (
              <><IconSettings /></>
            )}
          </Link>
          {!user && (
            <form action={async () => {
              'use server';
              await signOut();
              redirect('/login');
            }}>
            <button
              type="submit"
              className="flex items-center ">
              <IconLogout/>
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}