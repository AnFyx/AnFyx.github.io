import {CameraIcon, HomeIcon, LayoutGridIcon, SearchIcon, UserIcon} from "lucide-react";
import Link from "next/link";
import { getSessionRole } from "@/actions";

export default async function MobileNav() {
  const user = !['mod', 'admin'].includes(await getSessionRole());
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 shadow-[0_-4px_4px_-1px_rgba(0,0,0,0.1)] shadow-gray-400 dark:shadow-gray-600">
      <div className="flex text-gray-700 dark:text-gray-300 *:flex *:items-center">
        <div className="pl-2 bg-white dark:bg-gray-700 w-full relative z-10 *:size-12 *:flex *:items-center *:justify-center justify-around">
          <Link href="/" className="">
            <HomeIcon/>
          </Link>
          {user && (
            <>
              <Link href="/search" className="">
                <SearchIcon/>
              </Link>
              <Link href="/create">
                <CameraIcon/>
              </Link>
              <Link href="/browse" className="text-ig-red dark:text-ig-orange">
                <LayoutGridIcon/>
              </Link>
            </>
          )}
          <Link href="/profile" className=" ">
            <UserIcon/>
          </Link>
        </div>
      </div>
    </div>
  );
}