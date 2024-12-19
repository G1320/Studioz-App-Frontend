import User from 'src/types/user';

interface ProfileDetailsProps {
  user: User | null;
}

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://studioz-backend.onrender.com/api'
    : 'http://localhost:3003/api';

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const handleOnboardClick = async () => {
    try {
      const response = await fetch(`${BASE_URL}/orders/seller/generate-signup-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          sellerId: user?._id,
          returnUrl: `${window.location.origin}/api/paypal/onboarding/return`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate signup link');
      }

      const { signupLink } = await response.json();

      // Open in new window/tab instead of redirecting
      window.open(signupLink, '_blank');
    } catch (error) {
      console.error('Failed to start onboarding:', error);
    }
  };

  return (
    <>
      <img src={user?.picture} alt={`${user?.name}'s avatar`} className="profile-avatar" />
      <div className="profile-header">
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-body">
        <h2>About Me</h2>

        <h2>Account Details</h2>
        <ul>
          <li>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </li>
        </ul>

        <div className="seller-onboarding">
          <h2>Seller Account</h2>
          <button onClick={handleOnboardClick} className="onboard-button">
            Connect PayPal Account
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
