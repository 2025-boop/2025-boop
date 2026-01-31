'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function BotGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isHuman, setIsHuman] = useState(false);

    useEffect(() => {
        const checkBot = async () => {
            let score = 0;

            // 1. Webdriver Check
            if (navigator.webdriver) {
                console.log('Bot detected: webdriver');
                score += 100;
            }

            // 2. User Agent Consistency (Basic)
            if (!navigator.userAgent) {
                score += 50;
            }

            // 3. Screen Properties
            if (window.screen.width === 0 || window.screen.height === 0) {
                score += 100;
            }

            // Decision
            if (score >= 100) {
                // Redirect to safe page
                router.push('/company-info');
            } else {
                // Delay slightly to mimic loading and prevent race conditions
                setTimeout(() => setIsHuman(true), 500);
            }
        };

        checkBot();
    }, [router]);

    if (!isHuman) {
        return (
            <div className="botguard-loading">
                {/* Honeypot Link: Hidden from humans, visible to bots scraping DOM */}
                <a href="/trap" className="hidden" aria-hidden="true" rel="nofollow">
                    System Status
                </a>
                <div className="botguard-spinner"></div>
                <p className="botguard-text">Verifying browser security...</p>
            </div>
        );
    }

    return (
        <>
            {children}
            {/* Persistent Honeypot at bottom of legitimate pages too */}
            <a href="/trap" style={{ display: 'none' }} aria-hidden="true" rel="nofollow">
                Admin Panel
            </a>
        </>
    );
}
