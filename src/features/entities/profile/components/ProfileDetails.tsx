import React, { useState, useEffect } from 'react';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';
import { LogoutButton } from '@features/auth';
import { ProfileImageUploader } from '@shared/components';
import { useUserContext } from '@core/contexts';
import { setLocalUser } from '@shared/services';
import { useUpdateUserMutation } from '@shared/hooks/mutations';
import { useGoogleCalendar, useSubscription } from '@shared/hooks';

import {
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  CalendarIcon,
  CreditCardIcon,
  EditIcon,
  SaveIcon,
  OpenNewIcon,
  ChevronRightIcon,
  ShieldIcon
} from '@shared/components/icons';

import '../styles/_profile-page.scss';

interface ProfileDetailsProps {
  user: User | null;
}

interface EditableUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Section Title Component
const SectionTitle: React.FC<{
  icon: React.ElementType;
  title: string;
  description?: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="profile-section-title">
    <div className="profile-section-title__header">
      <div className="profile-section-title__icon">
        <Icon />
      </div>
      <h3 className="profile-section-title__text">{title}</h3>
    </div>
    {description && <p className="profile-section-title__description">{description}</p>}
  </div>
);

// Input Field Component
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  type?: string;
  icon?: React.ElementType;
  dir?: 'ltr' | 'rtl';
}> = ({ label, value, onChange, disabled = false, type = 'text', icon: Icon, dir }) => (
  <div className="profile-input-field">
    <label className="profile-input-field__label">{label}</label>
    <div className="profile-input-field__wrapper">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        dir={dir}
        className={`profile-input-field__input ${Icon ? 'profile-input-field__input--has-icon' : ''} ${disabled ? 'profile-input-field__input--disabled' : ''}`}
      />
      {Icon && (
        <div className="profile-input-field__icon">
          <Icon />
        </div>
      )}
    </div>
  </div>
);

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('profile');
  const { setUser } = useUserContext();
  const updateUserMutation = useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Reset edit data when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleNavigate = (path: string) => {
    langNavigate(path);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (!user?._id) return;

    updateUserMutation.mutate(
      { avatar: imageUrl },
      {
        onSuccess: (updatedUser) => {
          setLocalUser(updatedUser);
          setUser(updatedUser);
        }
      }
    );
  };

  const handleSave = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      updateUserMutation.mutate(
        {
          firstName: editData.firstName,
          lastName: editData.lastName,
          name: `${editData.firstName} ${editData.lastName}`.trim(),
          phone: editData.phone
        },
        {
          onSuccess: (updatedUser) => {
            setLocalUser(updatedUser);
            setUser(updatedUser);
            setIsEditing(false);
            setLoading(false);
          },
          onError: () => {
            setLoading(false);
          }
        }
      );
    } catch {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditData({
      firstName: user?.firstName || user?.name?.split(' ')[0] || '',
      lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  const isRTL = i18n.language === 'he';
  const {
    isConnected: isGoogleCalendarConnected,
    isLoading: isCalendarLoading,
    connect: connectCalendar,
    disconnect: disconnectCalendar
  } = useGoogleCalendar();
  const { hasSubscription, isPro, isStarter, subscription } = useSubscription();
  const hasActiveSubscription = hasSubscription && user?.subscriptionStatus === 'ACTIVE';

  // Get plan display info
  const getPlanName = () => {
    if (!hasActiveSubscription) return t('profile.subscription.freePlan', 'Free Plan');
    if (subscription?.planName) return subscription.planName;
    if (isPro) return t('subscriptions.plans.pro.name', 'Professional');
    if (isStarter) return t('subscriptions.plans.starter.name', 'Starter');
    return t('profile.subscription.proPlan', 'Pro Plan');
  };

  const getPlanPrice = () => {
    if (isPro) return '199';
    if (isStarter) return '39';
    return '0';
  };

  // Sumit onboarding status
  const isSumitConnected = Boolean(user?.sumitCompanyId && (user?.sumitApiKey || user?.sumitApiPublicKey));
  const showSumitCard = Boolean(user?.studios && user.studios.length > 0);

  const handleCalendarToggle = async () => {
    try {
      if (isGoogleCalendarConnected) {
        await disconnectCalendar();
      } else {
        await connectCalendar();
      }
    } catch (err) {
      console.error('Error toggling Google Calendar connection:', err);
    }
  };

  const getUserRole = () => {
    if (user?.isAdmin) return t('profile.roles.admin', 'Admin');
    if (user?.studios && user.studios.length > 0) return t('profile.roles.owner', 'Owner');
    return t('profile.roles.member', 'Member');
  };

  return (
    <div className="profile-container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <header className="profile-header-card">
        <div className="profile-header-card__bg" />
        <div className="profile-header-card__glow" />

        <div className="profile-header-card__content">
          {/* Avatar */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              {user ? (
                <ProfileImageUploader
                  currentImageUrl={user.avatar || user.picture}
                  onImageUpload={handleImageUpload}
                  userId={user._id}
                />
              ) : (
                <div className="profile-avatar profile-avatar--guest">
                  <PersonIcon className="profile-avatar__icon" />
                </div>
              )}
            </div>
            <div className="profile-avatar-status" />
          </div>

          {/* Info */}
          <div className="profile-header-info">
            <h1 className="profile-header-info__name">
              {user?.name || t('profile.guestUser', 'Guest')}
              <span className="profile-header-info__role">{getUserRole()}</span>
            </h1>
            <p className="profile-header-info__meta">
              <LocationIcon className="profile-header-info__icon" />
              {user?.email || t('profile.email.notAvailable', 'No email')}
            </p>
          </div>

          {/* Actions */}
          <div className="profile-header-actions">
            {!isEditing ? (
              <button className="profile-btn profile-btn--secondary" onClick={() => setIsEditing(true)}>
                <EditIcon /> {t('profile.buttons.editProfile', 'Edit Profile')}
              </button>
            ) : (
              <>
                <button className="profile-btn profile-btn--ghost" onClick={cancelEdit}>
                  {t('profile.buttons.cancel', 'Cancel')}
                </button>
                <button className="profile-btn profile-btn--primary" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    t('profile.buttons.saving', 'Saving...')
                  ) : (
                    <>
                      <SaveIcon /> {t('profile.buttons.saveChanges', 'Save Changes')}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="profile-grid">
        {/* Main Content - Personal Info */}
        <div className="profile-main">
          <div className="profile-card">
            <SectionTitle
              icon={PersonIcon}
              title={t('profile.sections.personalInfo', 'Personal Details')}
              description={t(
                'profile.sections.personalInfoDesc',
                'Manage your personal information and contact details'
              )}
            />

            <div className="profile-form-grid">
              <InputField
                label={t('profile.fields.firstName', 'First Name')}
                value={editData.firstName}
                onChange={(v) => setEditData({ ...editData, firstName: v })}
                disabled={!isEditing}
              />
              <InputField
                label={t('profile.fields.lastName', 'Last Name')}
                value={editData.lastName}
                onChange={(v) => setEditData({ ...editData, lastName: v })}
                disabled={!isEditing}
              />
              <InputField
                label={t('profile.fields.email', 'Email')}
                type="email"
                value={editData.email}
                onChange={(v) => setEditData({ ...editData, email: v })}
                disabled={true} // Email typically can't be changed
                icon={EmailIcon}
                dir="ltr"
              />
              <InputField
                label={t('profile.fields.phone', 'Phone')}
                type="tel"
                value={editData.phone}
                onChange={(v) => setEditData({ ...editData, phone: v })}
                disabled={!isEditing}
                icon={PhoneIcon}
                dir="ltr"
              />
            </div>
          </div>

          {/* Security Section (Coming Soon) */}
          <div className="profile-card profile-card--disabled profile-card--security">
            <SectionTitle
              icon={ShieldIcon}
              title={t('profile.sections.security', 'Security & Notifications')}
              description={t('profile.sections.securityDesc', 'Coming soon: Manage passwords and email preferences')}
            />
            <div className="profile-coming-soon">
              {t('profile.comingSoon', 'This section will be available in the next version')}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="profile-sidebar">
          {/* Google Calendar Integration */}
          <div className="profile-card profile-card--integration">
            <div className="profile-card__glow profile-card__glow--blue" />

            <SectionTitle
              icon={CalendarIcon}
              title={t('profile.sections.calendar', 'Calendar')}
              description={t('profile.sections.calendarDesc', 'Sync your bookings with Google Calendar')}
            />

            <div className="profile-integration-box">
              <div className="profile-integration-box__header">
                <div className="profile-integration-box__logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                    alt="Google Calendar"
                  />
                </div>
                <div className="profile-integration-box__info">
                  <h4>Google Calendar</h4>
                  <p>
                    {isGoogleCalendarConnected
                      ? t('profile.connected', 'Connected')
                      : t('profile.notConnected', 'Not connected')}
                  </p>
                </div>
                <div
                  className={`profile-integration-box__status ${isGoogleCalendarConnected ? 'profile-integration-box__status--active' : ''}`}
                />
              </div>

              <button
                className={`profile-btn profile-btn--full ${isGoogleCalendarConnected ? 'profile-btn--secondary' : 'profile-btn--google'}`}
                onClick={handleCalendarToggle}
                disabled={isCalendarLoading}
              >
                {isCalendarLoading ? (
                  t('profile.buttons.saving', 'Loading...')
                ) : isGoogleCalendarConnected ? (
                  t('profile.buttons.disconnect', 'Disconnect')
                ) : (
                  <>
                    {t('profile.buttons.connectAccount', 'Connect Account')} <OpenNewIcon />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sumit Onboarding / Payments */}
          {showSumitCard && (
            <div className="profile-card profile-card--integration">
              <div className="profile-card__glow profile-card__glow--green" />

              <SectionTitle
                icon={CreditCardIcon}
                title={t('profile.sections.sumit', 'Credit card processing')}
                description={t('profile.sections.sumitDesc', 'Receive payments directly to your bank account')}
              />

              <div className="profile-integration-box">
                <div className="profile-integration-box__header">
                  <div
                    className="profile-integration-box__logo profile-integration-box__logo--sumit"
                    aria-hidden="true"
                  >
                    <span>SUMIT</span>
                  </div>
                  <div className="profile-integration-box__info">
                    <h4>{t('profile.sumit.provider', 'Sumit.co.il')}</h4>
                    <p>
                      {isSumitConnected
                        ? t('profile.sumit.status.active', 'Connected & active')
                        : t('profile.sumit.status.pending', 'Onboarding status')}
                    </p>
                  </div>
                  <div
                    className={`profile-integration-box__status ${isSumitConnected ? 'profile-integration-box__status--active profile-integration-box__status--green' : ''}`}
                  />
                </div>

                <button
                  className={`profile-btn profile-btn--full ${isSumitConnected ? 'profile-btn--secondary' : 'profile-btn--sumit'}`}
                  onClick={() => handleNavigate('/onboarding')}
                  type="button"
                >
                  {isSumitConnected ? (
                    t('profile.sumit.buttons.manage', 'Manage')
                  ) : (
                    <>
                      {t('profile.sumit.buttons.continue', 'Continue onboarding')} <OpenNewIcon />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Subscription */}
          <div
            className={`profile-card profile-card--subscription ${hasActiveSubscription ? 'profile-card--subscription-active' : ''}`}
          >
            {hasActiveSubscription && <div className="profile-card__glow profile-card__glow--gold" />}

            <SectionTitle icon={CreditCardIcon} title={t('profile.sections.subscription', 'Subscription')} />

            <div className="profile-subscription-info">
              <div className="profile-subscription-info__header">
                <div>
                  <span className="profile-subscription-info__label">
                    {t('profile.subscription.currentPlan', 'Current Plan')}
                  </span>
                  <h3 className="profile-subscription-info__plan">{getPlanName()}</h3>
                </div>
                {hasActiveSubscription && (
                  <div className="profile-subscription-info__price">
                    <span className="profile-subscription-info__amount">₪{getPlanPrice()}</span>
                    <span className="profile-subscription-info__period">
                      /{t('profile.subscription.month', 'month')}
                    </span>
                  </div>
                )}
              </div>

              <div className="profile-subscription-info__details">
                <div className="profile-subscription-info__row">
                  <span>{t('profile.subscription.status', 'Status')}</span>
                  <span
                    className={`profile-subscription-info__status ${hasActiveSubscription ? 'profile-subscription-info__status--active' : ''}`}
                  >
                    {hasActiveSubscription
                      ? t('profile.subscription.active', 'Active')
                      : t('profile.subscription.inactive', 'Inactive')}
                  </span>
                </div>
              </div>

              <button
                className="profile-btn profile-btn--primary profile-btn--full"
                onClick={() => handleNavigate(hasActiveSubscription ? '/my-subscription' : '/subscription')}
              >
                {hasActiveSubscription
                  ? t('profile.buttons.manageSubscription', 'Manage Subscription')
                  : t('profile.buttons.upgrade', 'Upgrade')}
                <ChevronRightIcon className="profile-btn__chevron" />
              </button>
            </div>
          </div>

          {/* Logout */}
          {user && <LogoutButton className="profile-btn profile-btn--logout profile-btn--full" />}
        </div>
      </div>
    </div>
  );
};
