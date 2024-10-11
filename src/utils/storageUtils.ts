export const parseJSON = <T>(key: string, defaultValue: T | null): T | null => {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : defaultValue;
};

export const stringifyJSON = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
