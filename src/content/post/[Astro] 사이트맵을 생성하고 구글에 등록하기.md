---
title: '[Astro] 사이트맵을 생성하고 구글에 등록하기'
category: 'tech'
createDate: 2023-06-06
---

이번에는 `Astro`를 이용해서 사이트맵을 생성하고, 구글에 등록하는 방법에 대해서 알아보자.

## 사이트맵(Sitemap)

사이트맵은 웹사이트의 구조를 표현하는 파일로 크롤러가 웹사이트를 탐색할 때, 어떤 페이지가 있는지, 어떤 페이지가 중요한지, 어떤 페이지가 자주 변경되는지 등을 알려주는 역할을 한다.

일반적으로 사이트맵은 `sitemap.xml`이라는 이름으로 저장되며, 아래와 같은 형식으로 작성된다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://example.com/</loc>
    <lastmod>2021-06-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2021-06-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>
```

이제 본격적으로 `Astro`를 이용해서 사이트맵을 생성하고, 구글에 등록하는 방법에 대해서 알아보자.

## 사이트맵 생성하기

`Astro`에서는 `@astrojs/sitemap`이라는 패키지를 이용해서 사이트맵을 생성할 수 있다.

먼저, `@astrojs/sitemap` 패키지를 설치하자.

```bash
## 빠른 설치
# Using NPM
npx astro add sitemap
# Using Yarn
yarn astro add sitemap
# Using PNPM
pnpm astro add sitemap

## 수동 설치
npm install @astrojs/sitemap
```

그리고 `astro.config.*`파일에 아래와 같이 추가하자.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // ...
  site: [YOUR SITE],
  integrations: [sitemap()],
});
```

이제 `head`에 아래와 같이 `link` 태그를 추가하고 `public` 폴더에 `robots.txt` 파일을 생성해 아래와 같이 작성하자.

```astro
<!-- src/layouts/Layout.astro -->
<head>
  <link rel="sitemap" href="/sitemap-index.xml" />
</head>
```

```txt
<!-- public/robots.txt -->
User-agent: *
Allow: /

Sitemap: https://[YOUR SITE]/sitemap-index.xml
```

마지막으로, `astro build` 명령어를 실행하면 `dist` 폴더에 `sitemap-index.xml`, `sitemap-0.xml` 파일이 생성된 것을 확인할 수 있다.

```xml
<!-- /dist/sitemap-index.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://[YOUR SITE]/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
```

```xml
<!-- /dist/sitemap-0.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://[YOUR SITE>/]/loc>
  </url>
</urlset>
```

이제 구글에 사이트맵을 등록하기 위한 준비 작업이 끝났다.

## 구글에 사이트맵 등록하기

`Astro`에서 생성된 사이트맵은 `sitemap-index.xml` 파일을 통해 `sitemap-0.xml` 파일을 참조하고 있으므로, `sitemap-index.xml` 파일을 구글에 등록하면 된다.

먼저, [구글 검색 콘솔](https://search.google.com/search-console/about)에 접속해서 `색인 생성 > Sitemaps` 탭으로 이동하고 `sitemap-index.xml` 파일의 경로를 입력 후 `제출` 버튼을 누르면 된다.

나의 경우, `https://yusu.blog/sitemap-index.xml` 으로 입력했다.

![새 사이트맵 추가](https://github.com/Jangyusu/yusu.log/assets/60203731/329055f9-e517-4cfa-b389-46d99e941ae4)

이제 구글에서 사이트맵을 등록했고, 구글이 사이트를 크롤링할 때 사이트맵을 참조해서 크롤링을 진행하게 된다.

이렇게 사이트맵을 등록하면, 수동으로 페이지 색인을 요청할 필요가 없어지고, 구글이 사이트를 더 빠르게 크롤링할 수 있게 된다.

![제출된 사이트맵](https://github.com/Jangyusu/yusu.log/assets/60203731/14a95332-f18b-488f-8857-d2f9c3418c5d)

## 참고

- [Astro Docs - Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
