---
title: 'Vanilla Javascript로 Virtual DOM 구현하기'
category: 'tech'
createDate: 2023-07-11
---

가상 DOM(Virtual DOM)은 웹 애플리케이션의 성능을 향상시키기 위해 사용되는 기술입니다. 이번 포스트에서는 Vanilla JavaScript를 사용하여 가상 DOM을 구현하는 방법에 대해 자세히 알아보겠습니다.

## 가상 DOM(Virtual Document Object Model)

가상 DOM(Virtual DOM)은 JavaScript 라이브러리 또는 프레임워크에서 사용되는 개념으로, 웹 애플리케이션의 효율성과 성능을 개선하기 위해 도입되었습니다. 가상 DOM은 실제 DOM(Document Object Model)의 가벼운 복사본이며, 실제 DOM과 동기화하여 업데이트되는 방식으로 동작합니다.

실제 DOM은 웹 페이지의 구조를 표현하는 계층적인 객체 모델로, HTML 문서의 요소에 접근하고 조작할 수 있는 인터페이스를 제공합니다. 하지만 실제 DOM은 작은 변경 사항에도 전체 페이지를 다시 렌더링해야 하므로, 복잡한 애플리케이션에서는 성능 문제가 발생할 수 있습니다.

## 가상 DOM을 사용하는 이유

가상 DOM은 실제 DOM과 동기화되어 업데이트됩니다. 이를 통해 작은 변경 사항에도 전체 페이지를 다시 렌더링하지 않고 필요한 부분만 업데이트할 수 있습니다. 이러한 가상 DOM의 장점은 다음과 같습니다.

1. `성능 개선`: 가상 DOM은 변경된 부분만을 업데이트하여 실제 DOM 조작을 최소화하므로 성능이 향상됩니다. 실제 DOM은 작은 변경 사항에도 전체 페이지를 다시 렌더링해야 하지만, 가상 DOM은 변경된 부분만을 처리하여 불필요한 작업을 줄입니다.

2. `효율적인 렌더링`: 가상 DOM을 사용하면 실제 DOM을 직접 조작하는 대신 가상 DOM을 조작하므로, 실제 DOM 조작으로 인한 렌더링 비용을 줄일 수 있습니다. 또한, 가상 DOM은 변경 사항을 일괄적으로 처리하여 렌더링 주기를 최적화할 수 있습니다.

3. `상태 관리`: 가상 DOM은 애플리케이션의 상태 관리와 함께 사용될 수 있습니다. 예를 들어, 리액트는 가상 DOM과 함께 상태 관리 라이브러리인 리덕스와 결합하여 상태의 변화에 따른 가상 DOM 업데이트를 효율적으로 처리할 수 있습니다.

4. `팀 협업과 유지 보수`: 가상 DOM은 컴포넌트 기반 개발을 지원하여 여러 개발자가 동시에 작업하고 개별 컴포넌트를 재사용할 수 있습니다. 또한, 가상 DOM은 UI 로직과 상태를 분리하여 코드의 가독성과 유지 보수성을 향상시킵니다.

가상 DOM은 현대적인 웹 애플리케이션 개발에서 널리 사용되며, 다양한 라이브러리와 프레임워크에서 가상 DOM 개념을 활용하여 효율적이고 성능 우수한 애플리케이션을 구축할 수 있습니다.

## 가상 DOM의 구조

가상 DOM은 일반적으로 트리 구조로 표현됩니다. 트리 구조는 노드(Node)와 간선(Edge)으로 이루어진 계층적인 데이터 구조입니다. 가상 DOM 트리는 웹 애플리케이션의 UI 계층을 반영하며, 각 노드는 HTML 요소를 나타냅니다.

예를 들어, 다음과 같은 HTML 구조를 생각해보겠습니다:

```html
<div id="app">
  <h1>Hello, World!</h1>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

위의 HTML은 가상 DOM 트리로 표현하면 다음과 같을 수 있습니다:

```markdown
- div#app
  - h1
    - "Hello, World!"
  - ul
    - li
      - "Item 1"
    - li
      - "Item 2"
    - li
      - "Item 3"
```

각 노드는 트리에서의 위치와 노드의 유형에 따라 다른 속성을 가질 수 있습니다. 예를 들어, "div#app"는 실제 DOM에서의 id 속성을 나타내는 "app" 속성을 가질 수 있습니다. 이러한 속성들은 실제 DOM 업데이트 시에 사용되며, 변경된 부분을 찾는 데 도움을 줍니다.

가상 DOM은 효율적인 업데이트를 위해 변경된 부분을 추적하고 최소한의 작업만을 수행합니다. 변경 사항을 감지하고 가상 DOM을 업데이트한 후에는 실제 DOM과 비교하여 변경된 부분만을 업데이트합니다. 이를 통해 불필요한 렌더링 작업을 줄이고 성능을 개선할 수 있습니다.

프레임워크나 라이브러리에서 가상 DOM을 사용할 때는 가상 DOM의 구조와 업데이트 방식을 자동으로 처리하는 API와 알고리즘을 제공합니다. 이를 통해 개발자는 가상 DOM을 직접 다루지 않고도 효율적인 UI 업데이트를 구현할 수 있습니다.

## 가상 DOM 직접 구현하기

만약 가상 DOM을 직접 구현한다면 어떻게 구현할 수 있을까요? 가상 DOM을 직접 구현하는 것은 어려운 일이지만, 가상 DOM의 구조와 업데이트 방식을 이해하는 데 도움이 될 수 있습니다.

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

위의 HTML은 간단한 TODO 리스트를 나타냅니다. 이를 가상 DOM 트리로 표현하면 다음과 같을 수 있습니다.

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

위 트리를 사용하여 TODO 리스트를 구현해보겠습니다. 먼저, 가상 DOM은 다음과 같이 구성되어있을 수 있습니다.

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

`virtualDOM`을 사용하여 가상 DOM을 생성하면 아래와 같은 객체가 생성됩니다.

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

이렇게 생성된 객체를 이용해 실제 DOM을 생성할 수 있습니다.

```javascript
const virtualDOM = (type, props, ...children) => {
  /* 생략 */
};

createVirtualDOM(
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
```
