import '../styles/_index.scss';
import { CreateItemForm } from '@features/entities/items/forms/CreateItemForm';

const CreateItemPage = () => {
  return (
    <section className="create-item-page">
      <CreateItemForm />
    </section>
  );
};
export default CreateItemPage;
