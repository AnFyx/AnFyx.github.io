import Modal from "@/components/Modal";
import ModalPostContent from "@/components/ModalPostContent";
import Preloader from "@/components/Preloader";
import {Suspense} from "react";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string
  }
}

export default async function PostInModal(props: Props) {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  const { id } = await props.params;
  return (
    <Modal>
      <Suspense fallback={<Preloader />}>
        <ModalPostContent postId={id} />
      </Suspense>
    </Modal>
  );
}