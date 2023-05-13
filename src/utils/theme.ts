import { getStorage, setStorage } from '@utils/storage';

export const setTheme = (themeSwitch: Element) => {
  themeSwitch.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';

    setStorage('theme', theme);
    setUtterancesTheme();
  });
};

export const getTheme = () => {
  const storedTheme = getStorage('theme', '');

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const setUtterancesTheme = () => {
  const utterancesFrame = document.querySelector(
    '.utterances-frame'
  ) as HTMLIFrameElement;

  if (!utterancesFrame) {
    return;
  }

  const theme = getTheme();
  const message = {
    type: 'set-theme',
    theme: `github-${theme}`,
  };

  utterancesFrame.contentWindow &&
    utterancesFrame.contentWindow.postMessage(message, 'https://utteranc.es');
};
