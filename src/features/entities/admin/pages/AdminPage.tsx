import React from 'react';
import { AdminPanel } from '../components';
import { User, Studio } from 'src/types/index';

interface AdminPageProps {
  user: User | null;
  studios: Studio[];
}

const AdminPage: React.FC<AdminPageProps> = ({ user, studios }) => {
  return <AdminPanel user={user} studios={studios} />;
};

export default AdminPage;
