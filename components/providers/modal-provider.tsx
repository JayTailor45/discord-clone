"use client";

import CreateServerModal from "@/components/modals/create-server-modal";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import InviteModal from "../modals/invite-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { type } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
    </>
  );
};
