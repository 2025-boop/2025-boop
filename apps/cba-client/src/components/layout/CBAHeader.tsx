'use client';

import Link from 'next/link';
import { currentBrand } from '@/config/branding';

export function CBAHeader() {
    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" className="logo-link">
                    <img
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        className="main-logo"
                    />
                </Link>
            </div>
        </header>
    );
}
