import React, { useState } from 'react';
import { usePhoneVerification } from '@shared/hooks/index';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  initialPhoneNumber?: string;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified, initialPhoneNumber = '' }) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const { sendVerificationCode, verifyCode, isLoading, error } = usePhoneVerification({
    onVerificationSuccess: () => onVerified(phoneNumber)
  });

  const handleSendCode = async () => {
    const success = await sendVerificationCode(phoneNumber);
    if (success) {
      setCodeSent(true);
    }
  };

  const handleVerifyCode = async () => {
    await verifyCode(phoneNumber, verificationCode);
  };

  return (
    <div className="phone-verification">
      <div className="input-group">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          disabled={codeSent}
        />
        {!codeSent && (
          <button onClick={handleSendCode} disabled={isLoading || !phoneNumber}>
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        )}
      </div>

      {codeSent && (
        <div className="input-group">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            maxLength={6}
          />
          <button onClick={handleVerifyCode} disabled={isLoading || !verificationCode}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};
