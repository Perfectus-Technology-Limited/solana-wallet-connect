"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import RainbowkitWalletConnectButton from "./RainbowkitWalletConnectButton";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const Header = () => {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    console.log("address", address);
  }, [address]);

  return (
    <div className="flex justify-between items-center w-full header ">
      <Button
        className="bg-[#FF7C7C] text-[20px] md:text-[30px]  text-white ring-black ring-2 h-[40px] md:h-[60px] border-2 border-white font-slackey"
        onClick={() => router.push("https://choads.meme/")}
      >
        BACK
      </Button>
      {/* 
      <SolanaWalletConnectButton /> */}
      <div className="z-10">
        <RainbowkitWalletConnectButton />
      </div>
    </div>
  );
};

export default Header;
