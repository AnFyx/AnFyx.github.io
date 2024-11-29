import Link from "next/link";
import {signOut} from "@/auth";
import { getSessionRole } from "@/actions";
import { redirect } from "next/navigation";
import { IconCamera, IconHome, IconLayoutGrid, IconLogout, IconSearch, IconSettings, IconUser } from "@tabler/icons-react";

export default async function DesktopNav() {
  const user = !['mod', 'admin'].includes(await getSessionRole());
  return (
    <div className="hidden md:block px-4 pb-4 w-48 shadow-md shadow-gray-400 dark:shadow-gray-600">
      <div className="top-4 sticky">
        <img className="dark:invert"
             src="https://harlequin-keen-chickadee-753.mypinata.cloud/files/bafkreifatxsgok3qmpgee3wnnm52mieitsrul7in6vzvdortkc7jie6b6u"
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
            {user && (
              <>
              <IconUser />
              Profile
              </>
            )}
            {!user && (
              <>
              <IconSettings />
              Settings
              </>
            )}
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