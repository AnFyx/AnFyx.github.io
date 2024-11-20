import PostsGrid from "@/components/PostGrid";
import { CheckCheckIcon, CheckIcon, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  return (
    <div>
      <section className="flex justify-between items-center">
        <button>
          <ChevronLeft />
        </button>
        <div className="font-bold flex items-center gap-2">
          test
          <div className="size-5 rounded-full bg-ig-red inline-flex justify-center items-center text-white">
            <CheckIcon size={16} />
          </div>
        </div>
        <div></div>
      </section>
      <section className="mt-8 flex justify-center">
        <div className="size-48 p-2 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red">
          <div className="size-44 p-2 bg-red-500 rounded-full ">
            <div className="size-40 aspect-square overflow-hidden rounded-full">
              <img className="" src="https://cdn.pixabay.com/photo/2022/07/12/09/11/woman-7316856_960_720.jpg 1x, https://cdn.pixabay.com/photo/2022/07/12/09/11/woman-7316856_1280.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="text-center mt-4">
        <h1 className="text-xl font-bold">Name</h1>
        <p className="text-gray-500 mt-1 mb-1">subtitle</p>
        <p className="">bio</p>
      </section>
      <section className="mt-4">
        <div className="flex justify-center gap-4 font-bold">
          <Link href={""}>Posts</Link>
          <Link className="text-gray-400" href={"/highlights"}>
            Highlights
          </Link>
        </div>
      </section>
      <section className="mt-4">
        <PostsGrid></PostsGrid>
      </section>
    </div>
  );
}
