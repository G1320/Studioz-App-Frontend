export const sanitizeUserObject = (user) => {
  delete user.username;
  delete user.password;
  delete user.__v;
  delete user.sub;

  delete user.createdAt;
  delete user.updatedAt;
  delete user.email;
  delete user.studios;
  delete user.wishlists;
  delete user.cart;

  return user;
};
