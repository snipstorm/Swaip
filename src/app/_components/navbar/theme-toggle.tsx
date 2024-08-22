"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "~components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (theme === "light") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Change theme to dark mode"
        onClick={() => setTheme("dark")}
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Change theme to light mode"
      onClick={() => setTheme("light")}
    >
      <Moon className="size-4" />
    </Button>
  );
}
