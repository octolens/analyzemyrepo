import React from "react";
import Modal from "react-modal";
import SearchBar from "../SearchBar/SearchBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

Modal.setAppElement("#__next");

const MyModal = ({
  isOpen = false,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}) => {
  const router = useRouter();

  useEffect(() => setIsOpen(false), [router.asPath]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="modal-box absolute left-0 right-0 bottom-0 top-0 m-auto"
    >
      <SearchBar />
    </Modal>
  );
};

export default MyModal;
