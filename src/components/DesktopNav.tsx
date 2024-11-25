import {CameraIcon, LogOutIcon, HomeIcon, LayoutGridIcon, SearchIcon, UserIcon} from "lucide-react";
import Link from "next/link";
import {signOut} from "@/auth";
import { redirect } from "next/navigation";

export default function DesktopNav() {
  return (
    <div className="hidden md:block px-4 pb-4 w-48 shadow-md shadow-gray-400 dark:shadow-gray-600">
      <div className="top-4 sticky">
        <img className="dark:invert"
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
             alt=""/>
        <div className="ml-1 inline-flex flex-col gap-6 mt-8 *:flex *:items-center *:gap-2">
          <Link href={'/'}>
            <HomeIcon/>
            Home
          </Link>
          <Link href={'/search'}>
            <SearchIcon/>
            Search
          </Link>
          <Link href={'/browse'}>
            <LayoutGridIcon/>
            Browse
          </Link>
          <Link href={'/profile'}>
            <UserIcon/>
            Profile
          </Link>
          <Link href={'/create'}>
            <CameraIcon/>
            Create
          </Link>
          <form action={async () => {
              'use server';
              await signOut();
            }}>
            <button
              type="submit"
              className="flex items-center "
            >
              <LogOutIcon className="mr-2" />
                Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}