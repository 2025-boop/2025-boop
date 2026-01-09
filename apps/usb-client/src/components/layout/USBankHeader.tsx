'use client';

import Link from 'next/link';
import { currentBrand } from '@/config/branding';

export function USBankHeader() {
    return (
        <header className="site-header">
            <div className="header-left">
                {/* Hamburger menu - visible on mobile only */}
                <button className="hamburger-menu" aria-label="Menu">
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </button>
                <Link href="/" className="logo-link">
                    <img
                        className="logo"
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        onError={(e) => {
                            // Fallback if brand logo fails, though we copied it
                            console.error("Logo failed to load");
                        }}
                    />
                </Link>
            </div>
            <div className="header-links">
                <a href="#">U.S. Bank en Español</a>
                <a href="#">Customer Service</a>
                <a href="#">Locations</a>
            </div>
        </header>
    );
}
