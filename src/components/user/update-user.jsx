import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/user-service';
import GenericForm from '../path/to/GenericForm';
import useErrorHandling from '../../hooks/useErrorHandling';

export default function Update() {
  const handleError = useErrorHandling();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    avatar: '',
    isAdmin: '',
    id: null,
  });

  useEffect(() => {
    setFormData({
      id: localStorage.getItem('ID'),
      username: localStorage.getItem('Username'),
      email: localStorage.getItem('Email'),
      firstName: localStorage.getItem('First Name'),
      lastName: localStorage.getItem('Last Name'),
      isAdmin: localStorage.getItem('isAdmin'),
    });
  }, []);

  const updateData = async () => {
    try {
      const response = await updateUser(formData.id, formData);
      navigate('/read');
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (formData) => {
    updateData(formData);
  };

  const fields = [
    { label: 'Username', name: 'username', value: formData.username },
    { label: 'Email', name: 'email', value: formData.email },
    { label: 'First Name', name: 'firstName', value: formData.firstName },
    { label: 'Last Name', name: 'lastName', value: formData.lastName },
    { label: 'Password', name: 'password', value: formData.password, type: 'password' },
    { label: 'isAdmin', name: 'isAdmin', value: formData.isAdmin },
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
