---
title: 'Vanilla Javascript로 Virtual DOM 구현하기'
category: 'tech'
createDate: 2023-07-11
---

`가상 DOM (Virtual Document Object Model)`은 웹 애플리케이션의 성능을 향상시키기 위해 사용되는 기술이다.

일반적으로 프론트엔드 개발자라면 한번 쯤 사용해보는 `React`도 가상 DOM을 사용한 좋은 예라고 할 수 있다.

그래서 이번 포스트에서는 가상 DOM이 무엇이고 이를 활용하면 어떤 이점이 있는지, 또 직접 `Vanilla JavaScript`를 사용하여 가상 DOM을 구현하는 방법에 대해 알아보려고 한다.

## 가상 DOM(Virtual Document Object Model)이 뭘까?

가상 DOM은 UI의 가상 표현을 메모리에 유지하고, 실제 DOM 과 동기화하는 프로그래밍 개념으로 실제 DOM과 동기화하여 업데이트되는 방식으로 동작한다.

실제 DOM은 웹 페이지의 구조를 표현하는 계층적인 객체 모델로, HTML 문서의 요소에 접근하고 조작할 수 있는 인터페이스를 제공한다.

하지만 실제 DOM은 작은 변경 사항에도 전체 페이지를 다시 렌더링해야 하므로, 복잡한 애플리케이션에서는 성능 문제가 발생할 수 있다.

## 웹 페이지 렌더링 과정

웹 페이지는 렌더링 엔진에 의해 렌더링되며, 렌더링 엔진은 HTML 문서를 파싱하여 DOM 트리를 생성하고, CSS 파일을 파싱하여 CSSOM 트리를 생성한다.

그리고, DOM 트리와 CSSOM 트리를 결합하여 렌더 트리를 생성하고, 렌더 트리를 기반으로 페이지를 렌더링한다.

![렌더링 과정](https://web-dev.imgix.net/image/C47gYyWYVMMhDmtYSLOWazuyePF2/b6Z2Gu6UD1x1imOu1tJV.png?auto=format)

- DOM 트리는 HTML 문서의 요소에 접근하고 조작할 수 있는 인터페이스를 제공한다. DOM 트리는 계층적인 트리 구조로 표현되며, 각 노드는 HTML 요소를 나타낸다.

- CSSOM 트리는 CSS 파일의 스타일 정보를 표현하는 트리 구조로, 각 노드는 CSS 스타일 정보를 나타낸다.

- 렌더 트리는 DOM 트리와 CSSOM 트리를 결합하여 생성되는 트리 구조로, 각 노드는 렌더링을 위한 최종 정보를 나타내고 이를 기반으로 페이지를 렌더링한다.

## 가상 DOM을 사용하는 이유

웹 페이지 렌더링 과정에서 보듯 실제 DOM은 웹 페이지의 구조를 표현하는 계층적인 객체 모델로, HTML 문서의 요소에 접근하고 조작할 수 있는 인터페이스를 제공한다.

하지만 실제 DOM은 작은 변경 사항에도 전체 페이지를 다시 렌더링해야 하므로, 복잡한 애플리케이션에서는 성능 문제가 발생할 수 있다.

이러한 문제를 해결하기 위해 가상 DOM은 실제 DOM과 동기화되어 업데이트된다. 이를 통해 작은 변경 사항에도 전체 페이지를 다시 렌더링하지 않고 필요한 부분만 업데이트할 수 있다.

가상 DOM을 사용했을 때 이점은 다음과 같다.

1. `성능 개선`: 가상 DOM은 변경된 부분만을 업데이트하여 실제 DOM 조작을 최소화하므로 성능이 향상된다. 실제 DOM은 작은 변경 사항에도 전체 페이지를 다시 렌더링해야 하지만, 가상 DOM은 변경된 부분만을 처리하여 불필요한 작업을 줄인다.

2. `효율적인 렌더링`: 가상 DOM을 사용하면 실제 DOM을 직접 조작하는 대신 가상 DOM을 조작하므로, 실제 DOM 조작으로 인한 렌더링 비용을 줄일 수 있다. 또한, 가상 DOM은 변경 사항을 일괄적으로 처리하여 렌더링 주기를 최적화할 수 있다.

3. `상태 관리`: 가상 DOM은 애플리케이션의 상태 관리와 함께 사용될 수 있다. 예를 들어, 리액트는 가상 DOM과 함께 상태 관리 라이브러리인 리덕스와 결합하여 상태의 변화에 따른 가상 DOM 업데이트를 효율적으로 처리할 수 있다.

4. `팀 협업과 유지 보수`: 가상 DOM은 컴포넌트 기반 개발을 지원하여 여러 개발자가 동시에 작업하고 개별 컴포넌트를 재사용할 수 있다. 또한, 가상 DOM은 UI 로직과 상태를 분리하여 코드의 가독성과 유지 보수성을 향상시킨다.

## 가상 DOM 직접 구현하기

### 가상 DOM을 실제 DOM으로 변환

만약 가상 DOM을 직접 구현한다면 어떻게 구현할 수 있을까? 가상 DOM을 직접 구현하는 것은 어려운 일이지만, 가상 DOM의 구조와 업데이트 방식을 이해하는 데 도움이 될 수 있다.

```html
<div id="app">
  <form>
    <input type="text" />
    <button type="submit">추가</button>
  </form>
  <ul>
    <li>
      <input type="checkbox" />
      todo item 1
      <button class="remove">삭제</button>
    </li>
    <li>
      <input type="checkbox" />
      todo item 2
      <button class="remove">삭제</button>
    </li>
  </ul>
</div>
```

위의 HTML은 간단한 TODO 리스트를 나타낸다. 이를 가상 DOM 트리로 표현하면 다음과 같을 수 있다.

```markdown
- div#app
  - form
    - input[type="text"]
    - button[type="submit"]
  - ul
    - li
      - input[type="checkbox"]
      - "todo item 1"
      - button.remove
        - "삭제"
    - li
      - input[type="checkbox"]
      - "todo item 2"
      - button.remove
        - "삭제"
```

위 트리를 사용하여 TODO 리스트를 구현해보자. 먼저, 가상 DOM은 다음과 같이 구현할 수 있다.

```javascript
const virtualDOM = (type, props, ...children) => {
  return { type, props, children: children.flat() };
};

virtualDOM(
  'div',
  { id: 'app' },
  virtualDOM(
    'form',
    null,
    virtualDOM('input', { type: 'text' }),
    virtualDOM('button', { type: 'submit' }, '추가')
  ),
  virtualDOM(
    'ul',
    null,
    virtualDOM(
      'li',
      null,
      virtualDOM('input', { type: 'checkbox' }),
      'todo item 1',
      virtualDOM('button', { className: 'remove' }, '삭제')
    ),
    virtualDOM(
      'li',
      null,
      virtualDOM('input', { type: 'checkbox' }),
      'todo item 2',
      virtualDOM('button', { className: 'remove' }, '삭제')
    )
  )
);
```

가상 DOM을 생성하면 아래와 같은 객체가 생성된다.

```javascript
{
  "type": "div",
  "props": {
    "id": "app"
  },
  "children": [
    {
      "type": "form",
      "props": null,
      "children": [
        {
          "type": "input",
          "props": {
            "type": "text"
          },
          "children": []
        },
        {
          "type": "button",
          "props": {
            "type": "submit"
          },
          "children": [
            "추가"
          ]
        }
      ]
    },
    {
      "type": "ul",
      "props": null,
      "children": [
        {
          "type": "li",
          "props": null,
          "children": [
            {
              "type": "input",
              "props": {
                "type": "checkbox"
              },
              "children": []
            },
            "todo item 1",
            {
              "type": "button",
              "props": {
                "className": "remove"
              },
              "children": [
                "삭제"
              ]
            }
          ]
        },
        {
          "type": "li",
          "props": null,
          "children": [
            {
              "type": "input",
              "props": {
                "type": "checkbox"
              },
              "children": []
            },
            "todo item 2",
            {
              "type": "button",
              "props": {
                "className": "remove"
              },
              "children": [
                "삭제"
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

이제 생성된 객체를 이용해 실제 DOM을 생성해보자.

```javascript
function virtualDOM(type, props, ...children) {
  return { type, props, children: children.flat() };
}

function createElement(node) {
  // node가 string이라면 텍스트 노드를 생성
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const { type, props, children } = node;
  const element = document.createElement(type);

  // props가 존재한다면 element에 추가
  if (props) {
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        element.setAttribute(key, props[key]);
      }
    }
  }

  // children이 존재한다면 재귀적으로 createElement 실행
  if (children && children.length > 0) {
    children.forEach((child) => {
      element.appendChild(createElement(child));
    });
  }

  return element;
}

createElement(
  virtualDOM(
    'div',
    { id: 'app' },
    virtualDOM(
      'form',
      null,
      virtualDOM('input', { type: 'text' }),
      virtualDOM('button', { type: 'submit' }, '추가')
    ),
    virtualDOM(
      'ul',
      null,
      virtualDOM(
        'li',
        null,
        virtualDOM('input', { type: 'checkbox' }),
        'todo item 1',
        virtualDOM('button', { className: 'remove' }, '삭제')
      ),
      virtualDOM(
        'li',
        null,
        virtualDOM('input', { type: 'checkbox' }),
        'todo item 2',
        virtualDOM('button', { className: 'remove' }, '삭제')
      )
    )
  )
);
```

위 코드를 실행하면 원하던 TODO 리스트가 생성된다.

```html
<div id="app">
  <form>
    <input type="text" />
    <button type="submit">추가</button>
  </form>
  <ul>
    <li>
      <input type="checkbox" />
      todo item 1
      <button class="remove">삭제</button>
    </li>
    <li>
      <input type="checkbox" />
      todo item 2
      <button class="remove">삭제</button>
    </li>
  </ul>
</div>
```

지금까지 가상 DOM을 이용해 실제 DOM을 생성하는 과정으로, 이제는 실제 DOM을 변경된 속성이나 태그에 맞게 업데이트 함으로써 성능상의 이점을 얻을 수 있다.

### 실제 DOM 업데이트

```javascript
function updateElement(parent, newNode, oldNode) {
  // oldNode가 없다면 newNode를 추가
  if (!oldNode) {
    parent.appendChild(createElement(newNode));
  }

  // newNode가 없다면 oldNode를 제거
  else if (!newNode) {
    parent.removeChild(parent.childNodes[0]);
  }

  // 두 노드가 모두 텍스트 노드라면 텍스트 노드를 업데이트
  else if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      parent.textContent = newNode;
    }
  }

  // 두 노드의 타입이 다르다면 newNode로 교체
  else if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[0]);
  }

  // 두 노드의 타입이 같다면 업데이트
  else {
    const target = parent.childNodes[0];
    updateProps(target, newNode.props, oldNode.props);

    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;

    // 두 노드의 자식 노드를 업데이트
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(target, newNode.children[i], oldNode.children[i]);
    }
  }

  function updateProps(target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);

    // newProps와 oldProps를 비교하여 변경된 부분만 업데이트
    for (let key in props) {
      if (!newProps[key]) {
        target.removeAttribute(key);
      } else if (!oldProps[key] || newProps[key] !== oldProps[key]) {
        target.setAttribute(key, newProps[key]);
      }
    }
  }
}

const render = (
  <div id="app">
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
    <ul>
      <li>
        <input type="checkbox" />
        todo item 1<button class="remove">삭제</button>
      </li>
      <li>
        <input type="checkbox" />
        todo item 2<button class="remove">삭제</button>
      </li>
    </ul>
  </div>
);

document.body.appendChild(render);

const oldNode = render;
const newNode = (
  <div id="app">
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
    <ul>
      <li>
        <input type="checkbox" />
        todo item 1<button class="remove">삭제</button>
      </li>
      <li>
        <input type="checkbox" />
        todo item 2<button class="remove">삭제</button>
      </li>
      <li>
        <input type="checkbox" />
        todo item 3<button class="remove">삭제</button>
      </li>
    </ul>
  </div>
);

updateElement(document.body, newNode, oldNode);
```
