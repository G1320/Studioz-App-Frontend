import { usePhoneVerification } from '@shared/hooks/phone-verification';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import NotesIcon from '@mui/icons-material/Notes';

interface ReservationDetailsFormProps {
  customerName: string;
  customerPhone: string;
  comment: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onCommentChange: (comment: string) => void;
  isRTL: boolean;
  disabled?: boolean;
  onPhoneVerified: () => void;
}

export const ReservationDetailsForm: React.FC<ReservationDetailsFormProps> = ({
  customerName,
  customerPhone,
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
  const { t } = useTranslation('forms');

  const {
    sendVerificationCode,
    verifyCode,
    isLoading: isVerifying
  } = usePhoneVerification({
    onVerificationSuccess: () => {
      onPhoneVerified();
    }
  });

  const handleSendCode = async () => {
    if (!customerPhone) {
      toast.error(t('form.customerDetails.phone.error'));
      return;
    }
    const success = await sendVerificationCode(customerPhone);
    if (success) {
      setCodeSent(true);
    }
  };

  const handleTryAgain = () => {
    setCodeSent(false);
    setVerificationCode('');
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error(t('form.verification.code.error'));
      return;
    }
    await verifyCode(customerPhone, verificationCode);
  };

  return (
    <form className="customer-details">
      <div className="input-container">
        <PersonIcon className="input-icon" />
        <input
          type="text"
          className="customer-input has-icon"
          placeholder={t('form.customerDetails.name.placeholder')}
          value={customerName}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="input-container">
        <PhoneIcon className="input-icon" />
        <input
          type="tel"
          className="customer-input has-icon"
          placeholder={t('form.customerDetails.phone.placeholder')}
          value={customerPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
          dir={isRTL ? 'rtl' : 'ltr'}
          disabled={disabled || codeSent}
          pattern="[0-9]*"
        />
      </div>

      <div className="input-container full-width">
        <NotesIcon className="input-icon" />
        <textarea
          className="customer-input has-icon"
          placeholder={t('form.customerDetails.comment.placeholder')}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {!localStorage.getItem('isPhoneVerified') && !codeSent && (
        <button
          type="button"
          className="verification-button"
          onClick={handleSendCode}
          disabled={isVerifying || !customerPhone || codeSent}
        >
          {isVerifying
            ? t('form.verification.buttons.sending')
            : codeSent
              ? t('form.verification.buttons.sent')
              : t('form.verification.buttons.verify')}{' '}
        </button>
      )}

      {codeSent && !localStorage.getItem('isPhoneVerified') && (
        <div className="input-container full-width">
          <input
            type="text"
            className="customer-input"
            placeholder={t('form.verification.code.placeholder')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            pattern="[0-9]*"
          />
          <div className="verification-buttons">
          <button
            type="button"
            className="verification-button"
            onClick={handleVerifyCode}
            disabled={isVerifying || !verificationCode}
          >
              {isVerifying ? t('form.verification.buttons.verifying') : t('form.verification.buttons.submit')}
            </button>
            <button
              type="button"
              className="verification-button verification-button--secondary"
              onClick={handleTryAgain}
              disabled={isVerifying}
            >
              {t('form.verification.buttons.tryAgain')}
          </button>
          </div>
        </div>
      )}
    </form>
  );
};
