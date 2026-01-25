'use client';

import { BotGuard } from '@/components/security/BotGuard';

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="login-title">Session Ended</h1>

        <div className="login-form">
          <div className="status-content">
            <div className="status-icon-container">
              <div className="status-icon-circle status-icon-error">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </div>

            <p className="status-title">
              Your session has been terminated.
            </p>

            <p className="status-message">
              Please contact support for assistance with your account status.
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
