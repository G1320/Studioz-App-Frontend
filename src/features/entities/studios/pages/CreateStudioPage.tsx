import '../styles/_index.scss';
import { CreateStudioForm } from '@features/entities/studios/forms/CreateStudioForm';

const CreateStudioPage = () => {
  return (
    <section className="create-studio-page">
      <CreateStudioForm />
    </section>
  );
};

export default CreateStudioPage;
