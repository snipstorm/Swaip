import {
  CaretDown,
  Check,
  LinkSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { cn } from "~/lib/utils/cn";
import { shortenTokenAddress } from "~/lib/utils/shorten-token-address";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import { Avatar, AvatarFallback, AvatarImage } from "~components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~components/ui/tooltip";

type SelectTokenProps = {
  selectedToken: TokenDataType | null;
  setSelectedToken: (token: TokenDataType | null) => void;
  otherTokenAddress?: string;
  tokens: TokenDataType[];
};

export default function SelectToken({
  selectedToken,
  setSelectedToken,
  otherTokenAddress,
  tokens,
}: SelectTokenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = useMemo(() => {
    return tokens
      .filter((token) => token.address !== otherTokenAddress)
      .filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }, [tokens, otherTokenAddress, searchTerm]);

  const handleSelectToken = useCallback(
    (token: TokenDataType) => {
      setSelectedToken(token);
      setIsOpen(false);
    },
    [setSelectedToken],
  );

  const TokenItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const token = filteredTokens[index];
      if (!token) return null;

      return (
        <CommandItem
          key={token.address || index}
          value={token.symbol + token.name + token.address}
          onSelect={() => handleSelectToken(token)}
          style={style}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-8">
                <AvatarImage src={token.logoURI} alt={token.symbol} />
                <AvatarFallback>
                  {token.symbol.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {token.tags.includes("unknown") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <WarningCircle
                      weight="fill"
                      color="#FD7E14"
                      className="size-4 rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    This token is not verified
                  </TooltipContent>
                </Tooltip>
              )}
              {token.tags.includes("verified") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShieldCheck
                      weight="fill"
                      color="#10b981"
                      lightingColor="000000"
                      className="size-4 rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    This token is verified by Jupiter
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="font-medium">{token.symbol}</h1>
                <p className="text-xs text-muted-foreground">
                  {shortenTokenAddress(token.address)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{token.name}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center">
            <Check
              className={cn(
                "mr-2 size-4",
                token?.address === selectedToken?.address
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />

            <Link
              target="_blank"
              href={`https://solscan.io/token/${token.address}`}
              className="flex items-center gap-2 text-xs text-muted-foreground mr-2 hover:text-muted-foreground/90"
            >
              <LinkSimple />
            </Link>
          </div>
        </CommandItem>
      );
    },
    [filteredTokens, handleSelectToken, selectedToken],
  );

  return (
    <div>
      <button
        aria-label="Select token"
        className="flex items-center gap-2 rounded-full p-1.5 text-lg font-medium hover:bg-muted"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedToken ? (
          <>
            <Avatar className="size-8">
              <AvatarImage
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
              />
              <AvatarFallback>
                {selectedToken.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{selectedToken.symbol.toUpperCase()}</span>
          </>
        ) : (
          <span>Select Token</span>
        )}
        <CaretDown />
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search tokens..."
          value={searchTerm}
          onValueChange={(value) => setSearchTerm(value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <List
              height={300}
              itemCount={filteredTokens.length}
              itemSize={50}
              width="100%"
            >
              {TokenItem}
            </List>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
