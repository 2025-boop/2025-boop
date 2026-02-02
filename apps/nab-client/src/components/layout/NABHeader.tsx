'use client';

import Link from 'next/link';
import { currentBrand } from '@/config/branding';
import { useEffect, useState } from 'react';

export function NABHeader() {
    // Use state to store the date to strictly ensure client-side rendering matches
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // dynamic client-side date
        // Reference format: "Monday, 3 February 2025"
        const date = new Date();
        const dateString = date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setFormattedDate(dateString);
    }, []);

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link href="/" className="brand-link">
                    <img src={currentBrand.logo} alt={currentBrand.companyName} className="nab-logo-star" />
                    <span className="brand-text">Internet Banking</span>
                </Link>

                <div className="header-right">
                    <div className="header-date" id="current-date">{formattedDate}</div>
                    <span className="separator">|</span>
                    <a href="#">Help</a>
                    <span className="separator">|</span>
                    <a href="#">Security</a>
                    <span className="separator">|</span>
                    <a href="#">Contact us</a>
                    <span className="separator">|</span>
                    <a href="#">Locate us</a>
                </div>

                <button className="mobile-menu-btn" aria-label="Menu">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>
        </header>
    );
}
