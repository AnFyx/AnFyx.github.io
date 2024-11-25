import Modal from "@/components/Modal";
import ModalPostContent from "@/components/ModalPostContent";
import Preloader from "@/components/Preloader";
import {Suspense} from "react";

type Props = {
  params: {
    id: string
  }
}

export default async function PostInModal(props: Props) {
  const { id } = await props.params;
  return (
    <Modal>
      <Suspense fallback={<Preloader />}>
        <ModalPostContent postId={id} />
      </Suspense>
    </Modal>
  );
}