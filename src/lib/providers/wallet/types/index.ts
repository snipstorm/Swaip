import type {
  SupportedTransactionVersions,
  WalletName,
} from "@jup-ag/wallet-adapter";
import type { AllLanguage } from "@jup-ag/wallet-adapter/dist/types/contexts/TranslationProvider/i18n";
import type { IUnifiedTheme } from "@jup-ag/wallet-adapter/dist/types/contexts/UnifiedWalletContext";
import type { IHardcodedWalletStandardAdapter } from "@jup-ag/wallet-adapter/dist/types/contexts/WalletConnectionProvider/HardcodedWalletStandardAdapter";
import type { Cluster } from "@solana/web3.js";
import type { ReactNode } from "react";

export interface IWalletNotification {
  publicKey: string;
  shortAddress: string;
  walletName: string;
  metadata: {
    name: string;
    url: string;
    icon: string;
    supportedTransactionVersions?: SupportedTransactionVersions;
  };
}

export interface IUnifiedWalletMetadata {
  name: string;
  url: string;
  description: string;
  iconUrls: string[];
  additionalInfo?: string;
}

export interface IUnifiedWalletConfig {
  autoConnect: boolean;
  metadata: IUnifiedWalletMetadata;
  env: Cluster;
  walletPrecedence?: WalletName[];
  hardcodedWallets?: IHardcodedWalletStandardAdapter[];
  notificationCallback?: {
    onConnect: (props: IWalletNotification) => void;
    onConnecting: (props: IWalletNotification) => void;
    onDisconnect: (props: IWalletNotification) => void;
    onNotInstalled: (props: IWalletNotification) => void;
  };
  walletlistExplanation?: {
    href: string;
  };
  theme?: IUnifiedTheme;
  lang?: AllLanguage;
  walletAttachments?: Record<string, { attachment: ReactNode }>;
  walletModalAttachments?: {
    footer?: ReactNode;
  };
}
