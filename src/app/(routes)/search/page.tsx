import Preloader from "@/components/Preloader";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string }; // Adjusted type to reflect the actual shape
}) {
  const query = searchParams.query; // Directly access the query parameter

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <SearchForm />
        {query && (
          <Suspense fallback={<Preloader />}>
            <SearchResults query={query} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

