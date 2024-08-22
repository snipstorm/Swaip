"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~components/ui/button";
import MobileNavLinks from "./mobile-links";
import { ThemeToggle } from "./theme-toggle";
import WalletButton from "./wallet-button";

export const links = [
  {
    name: "Swap",
    href: "/",
  },
  {
    name: "About us",
    href: "https://swaip.org/404",
  },
];

export default function Navbar() {
  return (
    <nav className="relative z-40 h-20 w-full flex items-center justify-between gap-2 px-4 md:px-8">
      <figure className="md:w-60 shrink-0">
        <Image
          src="/icon.svg"
          alt="Swaip logo"
          width={48}
          height={48}
          className="size-12"
        />
        <figcaption className="sr-only">Swaip</figcaption>
      </figure>
      <ul className="flex items-center gap-2 text-sm text-foreground/80 font-light shrink-0 max-md:hidden">
        {links.map((link, x) => (
          <li key={x}>
            <Button
              variant="ghost"
              asChild
              className="rounded-full px-5 h-9"
              aria-label={link.name}
            >
              <Link href={link.href}>{link.name}</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="md:w-60 flex items-center justify-end gap-2 shrink-0">
        <WalletButton />
        <ThemeToggle />
        <MobileNavLinks />
      </div>
    </nav>
  );
}
