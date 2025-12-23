import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, http, isAddress } from 'viem';
import { sepolia } from 'viem/chains';
import { Contract, type JsonRpcSigner } from 'ethers';

import { Header } from './Header';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { confidentialMemeAbi } from '../abi/confidentialMemeAbi';
import { confidentialMemeFactoryAbi } from '../abi/confidentialMemeFactoryAbi';
import { CONTRACTS, DEFAULT_SUPPLY } from '../config/contracts';
import '../styles/TokenFactoryApp.css';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_HANDLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const MAX_U64 = (1n << 64n) - 1n;

type TokenInfo = {
  address: `0x${string}`;
  name: string;
  symbol: string;
  maxSupply: bigint;
  totalMinted: bigint;
  balanceHandle: `0x${string}`;
};

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(CONTRACTS.rpcUrl),
});

const numberFormatter = new Intl.NumberFormat('en-US');

const formatBigint = (value: bigint) => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    return value.toString();
  }
  return numberFormatter.format(Number(value));
};

const truncate = (value: string, left = 6, right = 4) => {
  if (value.length <= left + right) {
    return value;
  }
  return `${value.slice(0, left)}...${value.slice(-right)}`;
};

export function TokenFactoryApp() {
  const { address, isConnected } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: isZamaLoading, error: zamaError } = useZamaInstance();

  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [minting, setMinting] = useState<Record<string, boolean>>({});
  const [decrypting, setDecrypting] = useState<Record<string, boolean>>({});
  const [decryptedBalances, setDecryptedBalances] = useState<Record<string, string>>({});
  const [mintAmounts, setMintAmounts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: 'info' | 'success' | 'error'; message: string } | null>(
    null,
  );
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    maxSupply: DEFAULT_SUPPLY.toString(),
  });

  const hasFactoryAddress = useMemo(() => {
    const factoryAddress = CONTRACTS.factoryAddress as `0x${string}`;
    return isAddress(factoryAddress) && factoryAddress !== ZERO_ADDRESS;
  }, []);

  useEffect(() => {
    let active = true;
    const resolveSigner = async () => {
      if (!signerPromise) {
        if (active) {
          setSigner(null);
        }
        return;
      }
      const nextSigner = await signerPromise;
      if (active) {
        setSigner(nextSigner ?? null);
      }
    };
    resolveSigner();
    return () => {
      active = false;
    };
  }, [signerPromise]);

  const loadTokens = useCallback(async () => {
    if (!address || !hasFactoryAddress) {
      setTokens([]);
      return;
    }
    setIsFetching(true);
    setStatus(null);
    try {
      const tokenAddresses = (await publicClient.readContract({
        address: CONTRACTS.factoryAddress as `0x${string}`,
        abi: confidentialMemeFactoryAbi,
        functionName: 'getTokensByCreator',
        args: [address as `0x${string}`],
      })) as `0x${string}`[];

      const tokenInfos = await Promise.all(
        tokenAddresses.map(async (tokenAddress) => {
          const [name, symbol, maxSupply, totalMinted, balanceHandle] = await Promise.all([
            publicClient.readContract({
              address: tokenAddress,
              abi: confidentialMemeAbi,
              functionName: 'name',
            }) as Promise<string>,
            publicClient.readContract({
              address: tokenAddress,
              abi: confidentialMemeAbi,
              functionName: 'symbol',
            }) as Promise<string>,
            publicClient.readContract({
              address: tokenAddress,
              abi: confidentialMemeAbi,
              functionName: 'maxSupply',
            }) as Promise<bigint>,
            publicClient.readContract({
              address: tokenAddress,
              abi: confidentialMemeAbi,
              functionName: 'totalMinted',
            }) as Promise<bigint>,
            publicClient.readContract({
              address: tokenAddress,
              abi: confidentialMemeAbi,
              functionName: 'confidentialBalanceOf',
              args: [address as `0x${string}`],
            }) as Promise<`0x${string}`>,
          ]);

          return {
            address: tokenAddress,
            name,
            symbol,
            maxSupply,
            totalMinted,
            balanceHandle,
          } satisfies TokenInfo;
        }),
      );

      setTokens(tokenInfos);
    } catch (error) {
      console.error('Failed to load tokens:', error);
      setStatus({ tone: 'error', message: 'Failed to load your tokens from the factory.' });
    } finally {
      setIsFetching(false);
    }
  }, [address, hasFactoryAddress]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const handleCreateToken = async () => {
    if (!isConnected || !address) {
      setStatus({ tone: 'error', message: 'Connect your wallet to create a token.' });
      return;
    }
    if (!hasFactoryAddress) {
      setStatus({ tone: 'error', message: 'Factory address is missing. Update config/contracts.ts.' });
      return;
    }
    if (!signer) {
      setStatus({ tone: 'error', message: 'Wallet signer not ready yet.' });
      return;
    }

    const name = form.name.trim();
    const symbol = form.symbol.trim();
    if (!name || !symbol) {
      setStatus({ tone: 'error', message: 'Token name and symbol are required.' });
      return;
    }

    let maxSupply = DEFAULT_SUPPLY;
    try {
      maxSupply = BigInt(form.maxSupply.trim());
    } catch {
      setStatus({ tone: 'error', message: 'Max supply must be a valid number.' });
      return;
    }
    if (maxSupply <= 0n) {
      setStatus({ tone: 'error', message: 'Max supply must be greater than zero.' });
      return;
    }
    if (maxSupply > MAX_U64) {
      setStatus({ tone: 'error', message: 'Max supply exceeds uint64 limits.' });
      return;
    }

    try {
      setIsCreating(true);
      setStatus({ tone: 'info', message: 'Creating token on Sepolia...' });
      const factory = new Contract(CONTRACTS.factoryAddress, confidentialMemeFactoryAbi, signer);
      const tx = await factory.createToken(name, symbol, maxSupply);
      await tx.wait();
      setStatus({ tone: 'success', message: 'Token created successfully.' });
      setForm({ name: '', symbol: '', maxSupply: DEFAULT_SUPPLY.toString() });
      await loadTokens();
    } catch (error) {
      console.error('Failed to create token:', error);
      setStatus({ tone: 'error', message: 'Token creation failed. Please retry.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleMint = async (token: TokenInfo) => {
    if (!signer) {
      setStatus({ tone: 'error', message: 'Connect your wallet to mint.' });
      return;
    }
    const rawAmount = (mintAmounts[token.address] || '').trim();
    if (!rawAmount) {
      setStatus({ tone: 'error', message: 'Enter a mint amount.' });
      return;
    }
    let amount: bigint;
    try {
      amount = BigInt(rawAmount);
    } catch {
      setStatus({ tone: 'error', message: 'Mint amount must be a valid number.' });
      return;
    }
    if (amount <= 0n) {
      setStatus({ tone: 'error', message: 'Mint amount must be greater than zero.' });
      return;
    }
    if (amount > MAX_U64) {
      setStatus({ tone: 'error', message: 'Mint amount exceeds uint64 limits.' });
      return;
    }

    try {
      setMinting((prev) => ({ ...prev, [token.address]: true }));
      setStatus({ tone: 'info', message: `Minting ${rawAmount} ${token.symbol}...` });
      const tokenContract = new Contract(token.address, confidentialMemeAbi, signer);
      const tx = await tokenContract.freeMint(amount);
      await tx.wait();
      setStatus({ tone: 'success', message: 'Mint confirmed on-chain.' });
      await loadTokens();
    } catch (error) {
      console.error('Mint failed:', error);
      setStatus({ tone: 'error', message: 'Mint failed. Please retry.' });
    } finally {
      setMinting((prev) => ({ ...prev, [token.address]: false }));
    }
  };

  const handleDecrypt = async (token: TokenInfo) => {
    if (!instance) {
      setStatus({ tone: 'error', message: 'Encryption service is not ready yet.' });
      return;
    }
    if (!signer) {
      setStatus({ tone: 'error', message: 'Connect your wallet to decrypt.' });
      return;
    }
    if (!token.balanceHandle || token.balanceHandle === ZERO_HANDLE) {
      setStatus({ tone: 'info', message: 'No encrypted balance available yet.' });
      return;
    }

    try {
      setDecrypting((prev) => ({ ...prev, [token.address]: true }));
      setStatus({ tone: 'info', message: 'Requesting decryption...' });
      const keypair = instance.generateKeypair();
      const handleContractPairs = [
        {
          handle: token.balanceHandle,
          contractAddress: token.address,
        },
      ];
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [token.address];
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );
      const signerAddress = await signer.getAddress();
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        signerAddress,
        startTimeStamp,
        durationDays,
      );
      const decryptedValue = result[token.balanceHandle];
      setDecryptedBalances((prev) => ({
        ...prev,
        [token.address]: decryptedValue?.toString() ?? '0',
      }));
      setStatus({ tone: 'success', message: 'Balance decrypted locally.' });
    } catch (error) {
      console.error('Decrypt failed:', error);
      setStatus({ tone: 'error', message: 'Failed to decrypt balance.' });
    } finally {
      setDecrypting((prev) => ({ ...prev, [token.address]: false }));
    }
  };

  return (
    <div className="token-app">
      <Header />
      <main className="token-main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Confidential ERC7984 Launchpad</p>
            <h2>Launch encrypted meme tokens and keep balances private.</h2>
            <p className="hero-subtitle">
              Deploy your own confidential token, free mint it, and decrypt balances locally with the Zama relayer SDK.
            </p>
            <div className="status-pill">
              <span>Relayer</span>
              <strong>{isZamaLoading ? 'warming up' : zamaError ? 'offline' : 'ready'}</strong>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-header">
              <h3>Create a new token</h3>
              <p>Defaults to {formatBigint(DEFAULT_SUPPLY)} total supply.</p>
            </div>
            <div className="form-grid">
              <label>
                Token name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Confidential Cat"
                />
              </label>
              <label>
                Symbol
                <input
                  type="text"
                  value={form.symbol}
                  onChange={(event) => setForm((prev) => ({ ...prev, symbol: event.target.value.toUpperCase() }))}
                  placeholder="CCAT"
                />
              </label>
              <label>
                Max supply
                <input
                  type="number"
                  min="1"
                  value={form.maxSupply}
                  onChange={(event) => setForm((prev) => ({ ...prev, maxSupply: event.target.value }))}
                />
              </label>
            </div>
            <button className="primary-button" onClick={handleCreateToken} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create token'}
            </button>
            <div className="card-footnote">
              {hasFactoryAddress ? 'Sepolia only. Gas required.' : 'Set the factory address in config.'}
            </div>
          </div>
        </section>

        <section className="token-section">
          <div className="section-header">
            <div>
              <h3>Your tokens</h3>
              <p>Every token here was created from your wallet.</p>
            </div>
            <button className="ghost-button" onClick={loadTokens} disabled={isFetching}>
              {isFetching ? 'Refreshing...' : 'Refresh list'}
            </button>
          </div>

          {!isConnected && (
            <div className="empty-state">Connect your wallet to load your token collection.</div>
          )}
          {isConnected && tokens.length === 0 && !isFetching && (
            <div className="empty-state">No tokens yet. Create the first confidential meme token.</div>
          )}

          <div className="token-grid">
            {tokens.map((token) => {
              const progress =
                token.maxSupply > 0n
                  ? Number((token.totalMinted * 10000n) / token.maxSupply) / 100
                  : 0;
              const decrypted = decryptedBalances[token.address];
              return (
                <article key={token.address} className="token-card">
                  <div className="token-card-header">
                    <div>
                      <h4>{token.name}</h4>
                      <span className="token-symbol">{token.symbol}</span>
                    </div>
                    <span className="token-address">{truncate(token.address)}</span>
                  </div>
                  <div className="token-stats">
                    <div>
                      <span>Supply</span>
                      <strong>
                        {formatBigint(token.totalMinted)} / {formatBigint(token.maxSupply)}
                      </strong>
                    </div>
                    <div>
                      <span>Minted</span>
                      <strong>{progress.toFixed(2)}%</strong>
                    </div>
                  </div>
                  <div className="token-handle">
                    <span>Encrypted balance handle</span>
                    <code>{token.balanceHandle === ZERO_HANDLE ? 'Not minted yet' : truncate(token.balanceHandle)}</code>
                  </div>
                  <div className="token-actions">
                    <label>
                      Free mint amount
                      <input
                        type="number"
                        min="1"
                        value={mintAmounts[token.address] ?? ''}
                        onChange={(event) =>
                          setMintAmounts((prev) => ({ ...prev, [token.address]: event.target.value }))
                        }
                        placeholder="1000"
                      />
                    </label>
                    <button
                      className="primary-button compact"
                      onClick={() => handleMint(token)}
                      disabled={minting[token.address]}
                    >
                      {minting[token.address] ? 'Minting...' : 'Free mint'}
                    </button>
                  </div>
                  <div className="token-decrypt">
                    <div>
                      <span>Decrypted balance</span>
                      <strong>{decrypted ? formatBigint(BigInt(decrypted)) : '—'}</strong>
                    </div>
                    <button
                      className="ghost-button"
                      onClick={() => handleDecrypt(token)}
                      disabled={decrypting[token.address]}
                    >
                      {decrypting[token.address] ? 'Decrypting...' : 'Decrypt'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {status && (
          <div className={`status-banner ${status.tone}`}>
            <span>{status.message}</span>
          </div>
        )}
      </main>
    </div>
  );
}
