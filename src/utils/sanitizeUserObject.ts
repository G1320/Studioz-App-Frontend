import User from '../../../shared/types/user';

export const sanitizeUserObject = (user: User): Partial<User> => {
  // Create a shallow copy of the user object to avoid mutating the original
  const sanitizedUser: Partial<User> = { ...user };

  // Delete sensitive or unnecessary fields
  delete sanitizedUser.username;
  delete sanitizedUser.password;
  delete sanitizedUser.__v;
  delete sanitizedUser.sub;

  delete sanitizedUser.updatedAt;
  delete sanitizedUser.email;
  delete sanitizedUser.studios;
  delete sanitizedUser.wishlists;
  delete sanitizedUser.cart;

  return sanitizedUser;
};
