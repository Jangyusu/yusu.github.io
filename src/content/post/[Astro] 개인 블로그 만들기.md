---
title: '[Astro] 개인 블로그 만들기'
category: 'tech'
createDate: 2023-05-28
---

드디어 Astro를 이용한 개인 블로그를 만들었다.

이전에는 `jekyll`을 이용해서 만들었었는데, `Astro`의 경우 성능적으로 다른 프레임워크에 비해 정적 사이트 생성 속도가 빠르고 SEO 최적화가 잘 되어있다고 해서 선택하게 되었다.

또한, 내가 원하는 기능들과 디자인을 `Tailwind`를 이용해서 쉽게 구현할 수 있었다.

![성능 비교 데이터](https://github.com/Jangyusu/yusu.log/assets/60203731/469404d9-6222-4621-819f-b1c218e57683)

## Astro

[Astro 공식 문서](https://docs.astro.build/ko/concepts/mpa-vs-spa/) 에 따르면, Astro는 **MPA(Multi Page Application) 프레임워크**로 정적 사이트 생성 속도가 빠르고 SEO 최적화가 잘 되어있다고 한다.

블로그는 정적 사이트이기 때문에, SEO 최적화가 잘 되어있는 것이 중요하다고 생각했다.

또한, 방문하는 사용자들에게 빠른 페이지 로딩 속도를 제공하고 싶었기 때문에, Astro를 선택하게 되었다.

시험삼아 새로 만든 블로그의 이력서 페이지를 `Lighthouse`로 테스트 해 본 결과, 실제로 성능이 꽤 좋은 것을 확인할 수 있었다.

![Lighthouse 테스트 결과](https://github.com/Jangyusu/yusu.log/assets/60203731/34f3bc21-abef-45bf-abd2-4b18b10a6a60)

[Astro 시작하기](https://docs.astro.build/ko/install/auto/) 2023년 5월 28일 기준으로, Astro 공식 문서의 일부가 한글로 번역되어 있어 만약 Astro를 처음 사용하더라도 크게 어려움 없이 사용할 수 있을 것이다.

## Tailwind

이번에 만든 블로그는 `Tailwind`를 이용해서 디자인을 구현했다.

이전에 `jekyll`을 이용해서 만든 블로그의 경우, 디자인을 구현하기 위해 `Bootstrap`을 사용했었는데, Bootstrap의 경우 내가 원하는 디자인을 구현하기 까다로워 Tailwind를 사용하게 되었다.

[Add Integrations](https://docs.astro.build/ko/guides/integrations-guide/) Astro에서는 UI 프레임워크 뿐만 아니라, 기타 다른 기능들도 쉽게 사용할 수 있도록 공식적으로 지원하기 때문에, Tailwind를 사용하는 것이 어렵지 않았다.

![Astro Official Integrations](https://github.com/Jangyusu/yusu.log/assets/60203731/c2115c26-d2dd-4dc8-afab-eb23ceeca0f8)

## Dark Theme

예전부터 블로그를 직접 만든다면 `Dark Theme`는 꼭 구현해보고 싶었는데 이번 기회에 구현해보았다.

`Tailwind`에서는 `Dark Mode`를 쉽게 구현할 수 있도록 공식적으로 지원하고 있기 때문에, 어렵지 않게 기능을 구현할 수 있었다.

```astro
<!-- ThemeScript.astro -->
<script is:inline>
  (() => {
    if (typeof window !== 'undefined') {
      const $html = document.documentElement;
      const storageTheme = localStorage.getItem('theme')
        ? JSON.parse(localStorage.getItem('theme'))
        : null;
      const isSystemColorDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      if (!storageTheme && isSystemColorDark) {
        $html.classList.add('dark');
      } else if (storageTheme === 'dark') {
        $html.classList.add('dark');
      } else {
        $html.classList.remove('dark');
      }
    }
  })();
</script>
```

```astro
<!-- ThemeSwitcher.astro -->
<button
  role="checkbox"
  tabindex="0"
  class="theme-switcher cursor-pointer w-11 h-5 bg-gray-200 rounded-full px-1.5 flex items-center justify-end dark:justify-start dark:bg-gray-700 relative"
>
  <div
    class="w-4 h-4 rounded-full absolute transform ease-out bg-white dark:bg-gray-800 left-0.5 translate-x-0 dark:translate-x-6"
  >
  </div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-3 w-3 text-white dark:block hidden"
    viewBox="0 0 20 20"
    fill="#FFFFFF"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
    ></path>
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-3 w-3 text-white dark:hidden block"
    viewBox="0 0 20 20"
    fill="#FFD43B"
  >
    <path
      fill-rule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clip-rule="evenodd"></path>
  </svg>
</button>

<script>
  import { setTheme } from '@/utils/theme';

  const themeSwitcher = document.querySelector(
    '.theme-switcher'
  ) as HTMLButtonElement;
  setTheme(themeSwitcher);
</script>
```

```ts
// Theme.ts
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
```

<figure>
  <img alt="astro" src="https://github.com/Jangyusu/yusu.log/assets/60203731/adedeb9b-fd31-42b4-9efc-51bffa6e97e8" />
  <figcaption>Dark Theme 적용</figcaption>
</figure>

## 앞으로

`Astro`는 정보도 많이 부족하고 관련 커뮤니티도 활성화되어 있지 않아서 아직은 다른 프레임워크에 비해 부족한 점이 많다.

하지만, 정적 웹 사이트를 만드는데 있어서 매우 유용하고 성능적으로 뛰어난 프레임워크라고 생각한다. Astro가 더욱 발전하고 커뮤니티가 활성화되면, Astro를 사용하는 사람들이 많아질 것이라고 생각한다.

앞으로 블로그에 포스팅을 하면서 Astro를 사용하면서 느낀 점들을 계속해서 포스팅할 예정이다.
