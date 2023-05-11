import { getStorage } from '@utils/storage';

export const getTheme = () => {
  const storedTheme = getStorage('theme', '');

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};
