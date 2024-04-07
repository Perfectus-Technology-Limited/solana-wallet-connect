"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  Transaction,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy } from "lucide-react";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { toFixed } from "@/utils";

const Header = () => {
  const { connection } = useConnection();
  const router = useRouter();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [chainSelected, setChainSelected] = useState<boolean>(false);
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");
  const [solScanLink, setSolScanLink] = useState<string>("");
  const [showAdminBtn, setShowAdminBtn] = useState<boolean>(false);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    console.log("publicKey : ", publicKey);
    setUserWalletAddress(publicKey?.toBase58()!);
  }, [publicKey]);

  useEffect(() => {
    console.log("wallets : ", wallets);
  }, [wallets]);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      console.log("walletName : ", walletName);
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  useEffect(() => {
    const networkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;

    if (networkType === "devnet") {
      setSolScanLink(
        `https://solscan.io/account/${userWalletAddress}?cluster=devnet`
      );
    } else {
      setSolScanLink(`https://solscan.io/account/${userWalletAddress}`);
    }
  }, [userWalletAddress]);

  const handleCopyToClick = async () => {
    try {
      await navigator.clipboard.writeText(userWalletAddress);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  const admin_1 = process.env.NEXT_PUBLIC_ADMIN_WALLET_1!;

  const admins: string[] = [admin_1];

  useEffect(() => {
    if (userWalletAddress && admins) {
      const isAddressPresent = admins.includes(userWalletAddress);

      if (isAddressPresent === true) {
        setShowAdminBtn(true);
      } else setShowAdminBtn(false);
    }
  }, [userWalletAddress, admins]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-between items-center w-full max-w-[1200px] ">
        <Button className="bg-[#FF7C7C] text-[20px] md:text-[30px]  text-white ring-black ring-2 h-[40px] md:h-[60px] border-2 border-white font-slackey">
          MENU
        </Button>
        <div className="flex gap-2 items-center">
          {!publicKey ? (
            <>
              <DialogTrigger asChild>
                <Button className="bg-[#7CC0FF] text-[20px] md:text-[30px] text-white ring-black ring-2 h-[40px] md:h-[60px] border-2 border-white font-slackey z-50">
                  {connecting ? "connecting..." : "Connect Wallet"}
                </Button>
              </DialogTrigger>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex gap-2 bg-[#7CC0FF] text-[20px] md:text-[30px] text-white ring-black ring-2 h-[40px]  md:h-[60px] border-2 border-white font-slackey z-50">
                  <div className="">
                    <div className=" truncate md:w-[150px] w-[100px]  ">
                      {publicKey.toBase58()}
                    </div>
                  </div>
                  {balance ? (
                    <div>{toFixed(balance, 2)} SOL</div>
                  ) : (
                    <div>0 SOL</div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                <DropdownMenuItem className="flex justify-between">
                  <div className="flex gap-5">
                    <div onClick={handleCopyToClick}>
                      <Copy />
                    </div>
                    <Link href={solScanLink} target="_blank">
                      <SquareArrowOutUpRight />
                    </Link>
                  </div>
                  <Button
                    className="bg-[#ff5555] z-50 text-[20px]  text-white ring-black ring-2  border-2 border-white font-slackey"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showAdminBtn && userWalletAddress && (
            <Button
              className="bg-[#7CC0FF] text-[20px] md:text-[30px] text-white ring-black ring-2 h-[40px] md:h-[60px] border-2 border-white font-slackey hidden sm:flex z-50"
              onClick={() => router.push("/admin")}
            >
              Admin
            </Button>
          )}
        </div>

        <DialogContent
          className="max-w-[700px] bg-[#64d2d2] bg-[url('/button_assets/dots.png')] p-5"
          style={{
            borderRadius: "30px",
          }}
        >
          <DialogHeader className="absolute mt-[-50px] ml-[30px] bg-[#b65959] bg-[url('/button_assets/dots.png')] rounded-[30px] p-5 border-4 border-white ">
            <DialogTitle className="font-slackey text-white ">
              <div className="text-[20px] text-center">Join us in the</div>
              <div className="text-[30px] text-center">Choaderverse</div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex w-full justify-center  ">
            <div className="flex flex-col justify-start items-center space-y-5 mt-[50px] w-[300px] md:w-[650px] overflow-y-auto ">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  //onClick={() => select(wallet.adapter.name)}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  variant={"ghost"}
                  className=" h-[40px] hover:bg-transparent hover:text-white text-[20px] text-white font-slackey flex w-full justify-between"
                >
                  <div className="font-slackey text-[#ff7a01] wallet-name text-[20px]">
                    {wallet.adapter.name}
                  </div>
                  <div className="flex">
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={30}
                      width={30}
                      className="mr-5 "
                    />
                    <div className="flex justify-center items-center ">
                      <ChevronRight />
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="hidden md:flex justify-end w-full">
              <Image
                src={"/model_img.png"}
                width={300}
                height={600}
                alt="model banner"
                className="rounded-tr-[30px] rounded-br-[30px]"
              />
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default Header;
