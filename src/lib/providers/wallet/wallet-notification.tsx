import Link from "next/link";
import { toast } from "sonner";
import type { IUnifiedWalletConfig, IWalletNotification } from "./types";

const NotInstalledDescription = ({ url }: { url: string }) => (
  <span>
    Please go to the provider{" "}
    <Link
      target="_blank"
      rel="noopener noreferrer"
      tw="underline font-bold"
      href={url}
    >
      website
    </Link>
    to download.
  </span>
);

export const WalletNotification: IUnifiedWalletConfig["notificationCallback"] =
  {
    onConnect: ({ shortAddress }: IWalletNotification) => {
      toast.success("Wallet Connected", {
        description: `Connected to wallet ${shortAddress}`,
      });
    },

    onConnecting: ({ walletName }: IWalletNotification) => {
      toast.message(`Connecting to ${walletName}`);
    },

    onDisconnect: ({ walletName, shortAddress }: IWalletNotification) => {
      toast.message(`Disconnected from ${walletName}`, {
        description: `Disconnected from wallet ${shortAddress}`,
      });
    },

    onNotInstalled: ({ walletName, metadata }: IWalletNotification) => {
      toast.error(`${walletName} Wallet is not installed`, {
        description: <NotInstalledDescription url={metadata.url} />,
      });
    },
  };
