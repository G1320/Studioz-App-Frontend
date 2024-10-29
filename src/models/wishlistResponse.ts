import { Wishlist } from '.';

export default interface WishlistResponse {
  currWishlist: Wishlist;
  prevWishlist: { _id: string } | null;
  nextWishlist: { _id: string } | null;
}
