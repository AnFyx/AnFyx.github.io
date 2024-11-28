import Link from "next/link";
import {signOut} from "@/auth";
import { getSessionRole } from "@/actions";
import { redirect } from "next/navigation";
import { IconCamera, IconHome, IconLayoutGrid, IconLogout, IconSearch, IconUser } from "@tabler/icons-react";

export default async function DesktopNav() {
  const user = !['mod', 'admin'].includes(await getSessionRole());
  return (
    <div className="hidden md:block px-4 pb-4 w-48 shadow-md shadow-gray-400 dark:shadow-gray-600">
      <div className="top-4 sticky">
        <img className="dark:invert"
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
             alt=""/>
        <div className="ml-1 inline-flex flex-col gap-6 mt-8 *:flex *:items-center *:gap-2">
          <Link href={'/'}>
            <IconHome />
            Home
          </Link>
          {user && (
            <>
              <Link href={'/search'}>
                <IconSearch />
                Search
              </Link>
              <Link href={'/browse'}>
                <IconLayoutGrid />
                Browse
              </Link>
              <Link href={'/create'}>
                <IconCamera />
                Create
              </Link>
            </>
          )}
          <Link href={'/profile'}>
            <IconUser />
            Profile
          </Link>
          <form action={async () => {
              'use server';
              await signOut();
              redirect('/login');
            }}>
            <button
              type="submit"
              className="flex items-center "
            >
              <IconLogout className="mr-2" />
                Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}