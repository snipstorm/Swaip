"use client";

import { Gear } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "~/lib/utils/cn";
import { Button } from "~components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~components/ui/dialog";

type Props = {
  slippageBps: number; // in basis points (bps)
  setSlippageBps: (slippage: number) => void;
};

export default function SwapSettings({ slippageBps, setSlippageBps }: Props) {
  const [customSlippage, setCustomSlippage] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | "custom">(
    slippageBps,
  );

  const handleSlippageChange = (value: number | "custom") => {
    setSelectedOption(value);
    if (value !== "custom") {
      setSlippageBps(value);
      setCustomSlippage("");
    }
  };

  const handleCustomSlippageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setCustomSlippage(value);
    if (value && !isNaN(parseFloat(value))) {
      const numericValue = parseFloat(value);
      if (numericValue >= 0 && numericValue <= 100) {
        setSlippageBps(numericValue * 100); // Convert percentage to bps
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button aria-label="Open swap settings" className="absolute right-0">
          <Gear className="size-5 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit settings</DialogTitle>
          <DialogDescription>
            Set your preferred slippage tolerance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between gap-4 flex-col">
            <p className="font-medium">Slippage Tolerance</p>
            <div className="flex space-x-2">
              {[10, 50, 100].map((bps) => (
                <Button
                  key={bps}
                  className={cn("px-3 py-1 rounded", {
                    "bg-blue-700": selectedOption === bps,
                  })}
                  onClick={() => handleSlippageChange(bps)}
                >
                  {bps / 100}%
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-4 flex-col">
            <div className="flex items-center gap-2">
              <Button
                className={cn("px-3 py-1 rounded", {
                  "bg-blue-700": selectedOption === "custom",
                })}
                onClick={() => handleSlippageChange("custom")}
              >
                Custom
              </Button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter"
                  value={customSlippage}
                  onChange={handleCustomSlippageChange}
                  className="px-3 py-1 border rounded bg-transparent h-10"
                  disabled={selectedOption !== "custom"}
                />
                <span className="absolute top-1/2 -translate-y-1/2 right-3">
                  %
                </span>
              </div>
            </div>
            <DialogFooter className="font-medium text-blue-700 whitespace-nowrap">
              Current slippage: {slippageBps / 100}%
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
