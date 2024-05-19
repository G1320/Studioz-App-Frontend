import React from 'react';
import { register } from '../../services/auth-service';
import GenericForm from '../common/forms/genericForm';
import useErrorHandling from '../../hooks/ErrorAndSuccessHandling/useErrorHandling';

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
];

const CreateUser = () => {
  const handleError = useErrorHandling();
  const handleSubmit = async (formData) => {
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
