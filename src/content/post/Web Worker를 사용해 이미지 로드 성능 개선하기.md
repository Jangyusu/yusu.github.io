---
title: 'Web Worker를 사용해 이미지 로드 성능 개선하기'
category: 'tech'
createDate: 2023-10-09
---

`Web Worker`는 브라우저에서 동작하는 스크립트로, 브라우저의 메인 스레드와 별개로 동작하기 때문에, 메인 스레드가 처리해야 할 작업을 `Web Worker`에게 위임할 수 있다.

이렇게 하면 메인 스레드가 처리해야 할 작업을 `Web Worker`가 처리하기 때문에 메인 스레드는 더 많은 작업을 처리할 수 있게 된다.

이미지 로드 성능 개선하기에 앞서 `Web Worker`를 사용하는 방법에 대해 알아보자.

## Web Worker 사용하기

Main Thread 와 Web Worker 간의 통신은 `postMessage` 메서드를 사용한다.

- Main Thread

```js
// main.js
const worker = new Worker('worker.js');

worker.postMessage('post message to worker');

worker.onmessage = (e) => {
  console.log(e.data);
};
```

- Web Worker

```js
// worker.js
self.onmessage = (e) => {
  console.log(e.data);
  self.postMessage('post message to main');
};
```

Web Worker 통신 구조도는 아래와 같다.

![web-worker](https://github.com/Jangyusu/yusu.log/assets/60203731/70113831-5de6-47b1-8f42-0589fd33bacb)

## 이미지 로드 성능 개선하기

이제 `Web Worker`를 사용해 이미지 로드 성능을 개선해보자.

### 이미지 로드 성능 개선 전

```js
// 이미지 로드 함수
function loadImage(url, callback) {
  const img = new Image();
  img.onload = function () {
    callback(null, img);
  };
  img.onerror = function () {
    callback('Error loading image: ' + url);
  };
  img.src = url;
}

// 이미지 로드 시작
loadImage('image.jpg', function (error, image) {
  if (error) {
    console.error(error);
  } else {
    // 이미지 로드 성공
    document.body.appendChild(image);
  }
});
```

### 이미지 로드 성능 개선 후

Main Thread에서 이미지 로딩을 Worker Thread로 오프로드하면 이미지 로딩이 병렬로 처리함으로써 위 코드를 개선할 수 있다.

```js
// main.js
// 워커 스레드 생성
const worker = new Worker('imageLoader.js');

// 이미지 로드 요청
worker.postMessage('image.jpg');

// 워커 스레드로부터 이미지 로드 완료 이벤트를 수신
worker.onmessage = function (event) {
  const image = event.data;
  document.body.appendChild(image);
};

// 오류 처리
worker.onerror = function (event) {
  console.error('Error in Web Worker:', event.message);
};
```

```js
// imageLoader.js
// 워커 스레드에서 이미지 로드 함수 정의
function loadImage(url, callback) {
  const img = new Image();
  img.onload = function () {
    callback(null, img);
  };
  img.onerror = function () {
    callback('Error loading image: ' + url);
  };
  img.src = url;
}

// 워커 스레드로부터 메시지 수신
self.onmessage = function (event) {
  const imageUrl = event.data;
  loadImage(imageUrl, function (error, image) {
    if (error) {
      // 오류가 발생한 경우 오류 메시지를 메인 스레드로 전송
      self.postMessage({ error: error });
    } else {
      // 이미지 로드 성공한 경우 이미지를 메인 스레드로 전송
      self.postMessage({ image: image });
    }
  });
};
```

간단하게 `Worker Thread`를 사용하여 이미지 로딩 작업을 백그라운드에서 처리하고, `Main Thread`에서는 `Worker Thread`에 이미지 로딩 요청을 보내고 결과를 받아 처리한다.

이렇게 하면 `Main Thread`가 Blocking 되지 않고 이미지 로딩 성능을 개선할 수 있다.

만약 `Web Worker`를 사용하지 않는다면, `Main Thread`에서 이미지 로딩 작업을 처리하기 때문에 이미지 로딩 작업이 끝날 때까지 `Main Thread`는 다른 작업을 할 수 없다.

한번에 여러 이미지를 로딩해야 하는 경우에 `Web Worker`를 사용하면 `Main Thread`가 다른 작업을 할 수 있기 때문에 성능이 개선된다.

## 참고

- [Web Workers API](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API)
