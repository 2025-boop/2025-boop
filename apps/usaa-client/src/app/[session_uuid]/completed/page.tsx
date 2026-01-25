'use client';

import { BotGuard } from '@/components/security/BotGuard';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="login-title">Verification Complete</h1>

        <div className="login-form">
          <div className="status-content">
            <div className="status-icon-container">
              <div className="status-icon-circle status-icon-success">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <p className="status-title">
              Thank you. We have verified your information.
            </p>

            <p className="status-message">
              You may now close this window and continue using your account.
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
