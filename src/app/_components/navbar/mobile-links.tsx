import { List } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~components/ui/button";
import { links } from ".";

export default function MobileNavLinks() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <List className="size-4" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2 } }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 w-full bg-background flex flex-col items-center gap-2 text-sm text-foreground/80 font-light shrink-0"
          >
            {links.map((link, x) => (
              <motion.li
                key={x}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 * x + 0.15 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-full px-5 h-9"
                  aria-label={link.name}
                >
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
