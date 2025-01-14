import { usePhoneVerification } from '@hooks/phoneVerification';
import { useState } from 'react';
import { toast } from 'sonner';

interface CustomerDetailsFormProps {
  costumerName: string;
  costumerPhone: string;
  comment: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onCommentChange: (comment: string) => void;
  isRTL: boolean;
  disabled?: boolean;
  onPhoneVerified: () => void;
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  costumerName,
  costumerPhone,
  comment,
  onNameChange,
  onPhoneChange,
  onCommentChange,
  isRTL,
  disabled,
  onPhoneVerified
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const {
    sendVerificationCode,
    verifyCode,
    isLoading: isVerifying
  } = usePhoneVerification({
    onVerificationSuccess: () => {
      setIsPhoneVerified(true);
      onPhoneVerified();
    }
  });

  const handleSendCode = async () => {
    if (!costumerPhone) {
      toast.error('Please enter your phone number');
      return;
    }
    const success = await sendVerificationCode(costumerPhone);
    if (success) {
      setCodeSent(true);
      toast.success('Verification code sent');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    await verifyCode(costumerPhone, verificationCode);
  };

  return (
    <form className="customer-details">
      <div className="input-container">
        <input
          type="text"
          className="customer-input"
          placeholder="Your Name"
          value={costumerName}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="input-container">
        <input
          type="tel"
          className="customer-input"
          placeholder="Your Phone Number"
          value={costumerPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
          dir={isRTL ? 'rtl' : 'ltr'}
          disabled={disabled || codeSent}
        />
      </div>

      <div className="input-container full-width">
        <textarea
          className="customer-input"
          placeholder="Add any special requests or notes..."
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {!isPhoneVerified && (
        <button
          type="button"
          className="verification-button"
          onClick={handleSendCode}
          disabled={isVerifying || !costumerPhone || codeSent}
        >
          {isVerifying ? 'Sending...' : codeSent ? 'Code Sent' : 'Verify Phone'}
        </button>
      )}

      {codeSent && !isPhoneVerified && (
        <div className="input-container">
          <input
            type="text"
            className="customer-input"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
          <button
            type="button"
            className="verification-button"
            onClick={handleVerifyCode}
            disabled={isVerifying || !verificationCode}
          >
            {isVerifying ? 'Verifying...' : 'Submit Code'}
          </button>
        </div>
      )}
    </form>
  );
};
