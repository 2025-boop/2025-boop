'use client';

import Link from 'next/link';
import { currentBrand } from '@/config/branding';

export function ANZHeader() {
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
                <button className="register-btn">Register Now</button>
            </div>
        </header>
    );
}
