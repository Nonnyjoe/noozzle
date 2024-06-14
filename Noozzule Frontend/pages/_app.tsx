import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  zora,
  base,
  baseGoerli,
  sepolia,
  scrollSepolia,
  scrollTestnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    sepolia,
    // goerli,
    // sepolia,
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // zora,
    // baseGoerli,
    // base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [scrollSepolia] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'CertiFlex',
  projectId: '4c0ff852eb2c84659a24b7d7c8335bc1',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <ChakraProvider> 
        <Component {...pageProps} />
      </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
