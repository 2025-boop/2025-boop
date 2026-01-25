'use client';

import Link from 'next/link';
import { currentBrand } from '@/config/branding';

export function BankHeader() {
    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" className="logo" aria-label={`${currentBrand.companyName} Home`}>
                    <img
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        className="logo-img"
                    />
                </Link>

                <nav className="header-nav">
                    <a href="#" className="nav-link">JOIN USAA</a>
                    <a href="#" className="nav-link nav-link-register-full">REGISTER FOR ACCESS</a>
                    <a href="#" className="nav-link nav-link-register-mobile">REGISTER</a>
                    <span className="nav-separator">|</span>
                    <button className="close-btn" aria-label="Exit logon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="close-icon">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </nav>
            </div>
        </header>
    );
}
