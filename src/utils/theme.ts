import { getStorage, setStorage } from '@utils/storage';

export const setTheme = (themeSwitch: HTMLButtonElement) => {
  themeSwitch.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';

    setStorage('theme', theme);
    setGiscusTheme();
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

export const setGiscusTheme = () => {
  const theme = getTheme();

  function sendMessage(message: {
    setConfig: {
      theme: string;
    };
  }) {
    const iframe = document.querySelector(
      'iframe.giscus-frame'
    ) as HTMLIFrameElement;
    if (!iframe) return;
    iframe.contentWindow &&
      iframe.contentWindow.postMessage(
        { giscus: message },
        'https://giscus.app'
      );
  }

  sendMessage({
    setConfig: {
      theme,
    },
  });
};
