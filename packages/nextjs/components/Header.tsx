"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Bars3Icon, BugAntIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Auctions",
    href: "/auctions",
  },

  {
    label: "Buy",
    href: "/buy",
  },

  {
    label: "My NFTs",
    href: "/mynfts",
  },

  {
    label: "About",
    href: "/about",
  },

  {
    label: "Playground",
    href: "/playground",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 navbar bg-black bg-opacity-50 backdrop-blur-sm min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <Link
          href="/"
          passHref
          className="lg:hidden items-center gap-2 ml-4 shrink-0"
          onClick={e => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.location.reload();
            }
          }}
        >
          <Image alt="Moove logo" className="cursor-pointer" width={50} height={50} src="/moove-app-no-bg.png" />
        </Link>
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 rounded-full cursor-pointer hover:bg-[#323F61] flex items-center justify-center`}
            style={{
              width: "32px",
              height: "32px",
            }}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <ChevronDownIcon
              style={{
                width: "16px",
                height: "16px",
              }}
            />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link
          href="/"
          passHref
          className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0"
          onClick={e => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.location.reload();
            }
          }}
        >
          <Image alt="Moove logo" className="cursor-pointer" width={160} height={30} src="/logo.png" />
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end z-50 flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
