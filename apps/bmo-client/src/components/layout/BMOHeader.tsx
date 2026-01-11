'use client';

import Link from 'next/link';
import { currentBrand } from '@/config/branding';

export function BMOHeader() {
    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" className="logo-link">
                    <img
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        className="logo"
                    />
                </Link>
                <nav className="header-nav">
                    <a href="#" className="header-link">
                        <img src="/brands/bmo/location.svg" alt="" className="header-icon" />
                    </a>
                    <a href="#" className="header-link">
                        <img src="/brands/bmo/enclosed-help.svg" alt="" className="header-icon" />
                    </a>
                    <a href="#" className="header-link lang-toggle">FR</a>
                </nav>
            </div>
        </header>
    );
}
