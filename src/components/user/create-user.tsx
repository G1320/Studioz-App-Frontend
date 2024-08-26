import { register } from '../../services/auth-service';
import GenericForm from '../common/forms/genericForm';
import useErrorHandling from '../../hooks/ErrorAndSuccessHandling/useErrorHandling';
import { User } from '../../../../shared/types';

type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select';

interface Field {
  name: string;
  label: string;
  type: FieldType;
  value?: string;
  options?: string[];
}

const fields: Field[] = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
];

const CreateUser: React.FC = () => {
  const handleError = useErrorHandling();

  const handleSubmit = async (formData: Partial <User>) => {
    try {
      await register(formData);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <GenericForm
      title="Create New User"
      fields={fields}
      onSubmit={handleSubmit}
      className="create-user-form"
    />
  );
};

export default CreateUser;
