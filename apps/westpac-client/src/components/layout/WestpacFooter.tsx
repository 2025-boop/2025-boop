'use client';

import { useState } from 'react';

export function WestpacFooter() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <footer className="footer">
            {/* Divider */}
            <div className="footer__divider"></div>

            {/* Security Features Accordion */}
            <div className="footer__security">
                <button
                    className="footer__security-toggle"
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span>Security features</span>
                    <span className="footer__security-icon">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expandable content */}
                <div className={`footer__security-content ${!isExpanded ? 'collapsed' : ''}`}>
                    {/* Online Guardian - Centered */}
                    <div className="footer__guardian">
                        <img
                            src="/brands/westpac/online-guardian.svg"
                            alt="Online Guardian"
                            className="footer__guardian-logo"
                        />
                    </div>
                </div>
            </div>

            {/* Legal Links - Stacked vertically */}
            <div className="footer__legal">
                <a href="#" className="footer__legal-link">Terms &amp; Conditions</a>
                <a href="#" className="footer__legal-link">Privacy policy</a>
            </div>

            {/* Copyright with globe icon */}
            <div className="footer__copyright">
                <svg className="footer__copyright-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>© 2026 Westpac New Zealand Limited</span>
            </div>
        </footer>
    );
}
