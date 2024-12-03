import Preloader from "@/components/Preloader";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import {Suspense} from "react";
import {auth} from "@/auth";
import { redirect } from "next/navigation";
import { getSessionRole } from "@/actions";

export default async function SearchPage({
  searchParams,
}:{
  searchParams: { query: string },
}) {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  const { query } = await searchParams;
  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <SearchForm />
        {typeof query !== 'undefined' && (
          <Suspense fallback={<Preloader />}>
            <SearchResults query={query} />
          </Suspense>
        )}
      </div>
    </div>
  );
}