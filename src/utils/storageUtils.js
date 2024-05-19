export const parseJSON = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
};

export const stringifyJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
