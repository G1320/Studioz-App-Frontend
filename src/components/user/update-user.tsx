import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/user-service';
import GenericForm from '../common/forms/genericForm';
import useErrorHandling from '../../hooks/errorAndSuccessHandling/useErrorHandling';

export default function Update() {
  const handleError = useErrorHandling();
  const navigate = useNavigate();

  interface FormData {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    avatar?: string;
    isAdmin?: boolean;
    id: string ;
  }

  type FieldType = 'text' | 'password' | 'email' | 'checkbox';

interface Field {
  label: string;
  name: string;
  value: string | boolean | undefined;
  type?: FieldType;
}

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    avatar: '',
    isAdmin: false,
    id: '',
  });

  useEffect(() => {
    setFormData({
      id: localStorage.getItem('ID') || '',
      username: localStorage.getItem('Username') || '',
      email: localStorage.getItem('Email') || '',
      firstName: localStorage.getItem('First Name') || '',
      lastName: localStorage.getItem('Last Name') || '',
      isAdmin: localStorage.getItem('isAdmin') === 'true',
        });
  }, []);

  const updateData = async (formData:FormData) => {
    if (!formData.id) {
      handleError(new Error("User ID is missing"));
      return;
    }
    try {
      await updateUser(formData.id, formData);
      navigate('/read');
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (data: Record<string, any>) => {
    const formData: FormData = {
      id: data.id || '', 
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      avatar: data.avatar,
      isAdmin: data.isAdmin === 'true',
    };
    
    updateData(formData);
  };

  const fields: Field[] = [
    { label: 'Username', name: 'username', value: formData.username, type: 'text' },
    { label: 'Email', name: 'email', value: formData.email, type: 'email' },
    { label: 'First Name', name: 'firstName', value: formData.firstName, type: 'text' },
    { label: 'Last Name', name: 'lastName', value: formData.lastName, type: 'text' },
    { label: 'Password', name: 'password', value: formData.password, type: 'password' },
    { label: 'isAdmin', name: 'isAdmin', value: formData.isAdmin ? 'true' : 'false', type: 'checkbox' },
  ];
  

  return (
    <GenericForm
      title="Update User"
      fields={fields}
      onSubmit={handleSubmit}
      className="create-form"
      btnTxt="Submit"
    />
  );
}
