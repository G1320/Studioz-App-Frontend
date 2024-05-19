import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { useUpdateStudioMutation } from '../../../hooks/mutations/studios/studioMutations';
import { useStudio } from '../../../hooks/dataFetching/useStudio';

const EditStudio = () => {
  const navigate = useNavigate();
  const { studioId } = useParams();
  const { data: studio } = useStudio(studioId);

  const updateStudioMutation = useUpdateStudioMutation(studioId);

  const fields = [
    { name: 'name', label: 'Name', type: 'text', value: studio?.name },
    { name: 'description', label: 'Description', type: 'text', value: studio?.description },
  ];

  const handleSubmit = async (formData) => {
    updateStudioMutation.mutate(formData);
    navigate(`/Studio/${studioId}`);
  };

  return (
    <section className="edit-studio">
      <GenericForm
        title="Edit Studio"
        fields={fields}
        onSubmit={handleSubmit}
        className="edit-studio-form"
      />
    </section>
  );
};

export default EditStudio;
