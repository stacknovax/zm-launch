import { createConfig, createStorage, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia } from 'wagmi/chains';
import { CONTRACTS } from './contracts';

const memoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
};

export const chains = [sepolia] as const;

export const config = createConfig({
  chains,
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(CONTRACTS.rpcUrl),
  },
  storage: createStorage({ storage: memoryStorage() }),
  ssr: false,
});
