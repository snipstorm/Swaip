import { useUnifiedWalletContext, useWallet } from "@jup-ag/wallet-adapter";
import {
  useWalletConnectButton,
  useWalletDisconnectButton,
} from "@solana/wallet-adapter-base-ui";
import Image from "next/image";
import { shortenTokenAddress } from "~/lib/utils/shorten-token-address";
import { Button } from "~components/ui/button";

export default function WalletButton() {
  const wallet = useWallet();
  const connect = useUnifiedWalletContext();
  const { buttonDisabled, walletIcon, onButtonClick } =
    useWalletDisconnectButton();
  const { buttonState } = useWalletConnectButton();

  const buttonClasses = "text-sm rounded-full px-5 h-9";

  if (wallet.connected) {
    return (
      <Button
        onClick={onButtonClick}
        variant="ghost"
        className={`flex items-center gap-2 ${buttonClasses}`}
        aria-label="disconnect wallet"
        disabled={buttonDisabled}
      >
        {walletIcon && (
          <Image src={walletIcon} alt="Wallet Icon" width={16} height={16} />
        )}
        <span className="text-xs">
          {wallet.publicKey && shortenTokenAddress(wallet.publicKey.toString())}
        </span>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => connect.setShowModal(true)}
      variant="secondary"
      className={buttonClasses}
      aria-label="connect wallet"
    >
      {buttonState === "connecting" ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
