"use client";
import React, { useEffect } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const PageView = () => {
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (openConnectModal) {
      openConnectModal();
    }
  }, [openConnectModal]);

  return <div className="flex items-center justify-center min-h-screen"></div>;
};

export default PageView;
