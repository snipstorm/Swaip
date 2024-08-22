"use client";

import { type PropsWithChildren, useMemo } from "react";

import {
  ConnectionProvider,
  UnifiedWalletProvider,
} from "@jup-ag/wallet-adapter";
import {
  type Adapter,
  type BaseSignerWalletAdapter,
  WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-wallets";
import { initialize as initializeSolflareAndMetamaskSnap } from "@solflare-wallet/wallet-adapter";
import { env } from "~/env";
import {
  metadata,
  type WalletAdapterWithMutableSupportedTransactionVersions,
} from "../../constants/wallet";
import { WalletNotification } from "./wallet-notification";

initializeSolflareAndMetamaskSnap();

export default function WalletProvider({ children }: PropsWithChildren) {
  const wallets: Adapter[] = useMemo(() => {
    const walletConnectWalletAdapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> | null =
      (() => {
        const adapter: WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter> =
          new WalletConnectWalletAdapter({
            network: WalletAdapterNetwork.Mainnet,
            options: {
              relayUrl: "wss://relay.walletconnect.com",
              projectId: metadata.walletConnectProjectId,
              metadata: {
                name: metadata.name,
                description: metadata.description,
                url: metadata.url,
                icons: metadata.iconUrls,
              },
            },
          }) as WalletAdapterWithMutableSupportedTransactionVersions<BaseSignerWalletAdapter>;

        adapter.supportedTransactionVersions = new Set(["legacy"]);
        return adapter;
      })();

    return [walletConnectWalletAdapter].filter(
      (item) => item && item.name && item.icon,
    ) as Adapter[];
  }, []);

  const params: Omit<Parameters<typeof UnifiedWalletProvider>[0], "children"> =
    useMemo(
      () => ({
        wallets: wallets,
        config: {
          autoConnect: true,
          env: "mainnet-beta",
          metadata: {
            name: "UnifiedWallet",
            description: "UnifiedWallet",
            url: `https://${process.env.VERCEL_URL ?? "localhost:3000"}`,
            iconUrls: [
              `https://${process.env.VERCEL_URL ?? "localhost:3000"}/icon.svg`,
            ],
          },
          notificationCallback: WalletNotification,
          theme: "dark",
          lang: "en",
        },
      }),
      [wallets],
    );

  return (
    <ConnectionProvider endpoint={env.NEXT_PUBLIC_SOLANA_RPC_URL}>
      <UnifiedWalletProvider {...params}>{children}</UnifiedWalletProvider>
    </ConnectionProvider>
  );
}
