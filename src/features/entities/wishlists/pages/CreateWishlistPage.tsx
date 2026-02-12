import '../styles/_index.scss';
import { CreateWishlistForm } from '@features/entities/wishlists/forms/CreateWishlistForm';

const CreateWishlistPage = () => {
  return (
    <section className="create-wishlist-page">
      <CreateWishlistForm />
    </section>
  );
};
export default CreateWishlistPage;
