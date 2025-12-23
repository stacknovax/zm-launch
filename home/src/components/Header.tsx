import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <div className="brand-mark" aria-hidden="true" />
            <div>
              <p className="header-title">Confidential Meme Launchpad</p>
              <p className="header-subtitle">ERC7984 tokens with encrypted balances</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
