// export const filterBySubcategory = <T extends { subCategory?: string }>(data: T[], subCategory: string): T[] => {
//   return data.filter((item) => item.subCategory?.toLowerCase() === subCategory.toLowerCase());
// };
export const filterBySubcategory = <T extends { subCategories?: string[]; subCategory?: string }>(
  data: T[],
  subCategory: string
): T[] => {
  return data.filter((item) => {
    // Check both array and legacy field
    return (
      item.subCategories?.some((sub) => sub.toLowerCase() === subCategory.toLowerCase()) ||
      item.subCategory?.toLowerCase() === subCategory.toLowerCase()
    );
  });
};
