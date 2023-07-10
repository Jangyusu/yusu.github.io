---
title: 'Vanilla Javascript로 Virtual DOM 구현하기'
category: 'tech'
createDate: 2023-07-11
---

가상 DOM(Virtual DOM)은 웹 애플리케이션의 성능을 향상시키기 위해 사용되는 기술입니다. 이번 포스트에서는 Vanilla JavaScript를 사용하여 가상 DOM을 구현하는 방법에 대해 자세히 알아보겠습니다.

## 가상 DOM(Virtual DOM)이란?

가상 DOM은 실제 DOM(Document Object Model)과 대응되는 메모리 상의 가벼운 복사본입니다. 웹 애플리케이션에서는 사용자 인터랙션에 따라 DOM이 동적으로 변경되는데, 이때마다 실제 DOM을 직접 조작하는 것은 비용이 많이 들게 됩니다. 따라서 가상 DOM을 사용하여 변경 사항을 추적하고, 최적화된 방식으로 실제 DOM에 반영하는 것입니다.

## 가상 DOM 구현하기

Vanilla JavaScript를 사용하여 가상 DOM을 구현해보겠습니다. 아래와 같은 단계로 진행할 수 있습니다.

1. 가상 DOM 요소 생성하기
   가상 DOM 요소를 나타내는 JavaScript 객체를 생성합니다. 각 객체는 태그 이름, 속성, 자식 요소 등을 포함합니다. 예를 들어, div 요소를 나타내는 가상 DOM 요소 객체는 다음과 같습니다.

   ```javascript
   const virtualElement = {
     tag: 'div',
     attrs: {
       id: 'myDiv',
       class: 'container',
     },
     children: [
       {
         tag: 'h1',
         attrs: {
           class: 'title',
         },
         children: ['Hello, Virtual DOM!'],
       },
       {
         tag: 'p',
         attrs: {},
         children: ['This is a paragraph.'],
       },
     ],
   };
   ```

2. 가상 DOM 업데이트하기
   가상 DOM은 실제 DOM과 동기화되어야 합니다. 따라서 가상 DOM을 업데이트하는 함수를 작성해야 합니다. 이 함수는 변경된 가상 DOM 요소를 기반으로 새로운 가상 DOM 트리를 생성하고, 이전 가상 DOM과 비교하여 변경 사항을 찾습니다.

   ```javascript
   // 가상 DOM을 업데이트하는 함수
   function updateVirtualDOM(oldVirtualDOM, newVirtualDOM) {
     // 가상 DOM의 태그 이름이 다르면 전체를 업데이트해야 함
     if (oldVirtualDOM.tag !== newVirtualDOM.tag) {
       // 새로운 가상 DOM으로 대체
       return newVirtualDOM;
     }

     // 가상 DOM의 태그 이름이 같으면 속성과 자식 요소를 업데이트함
     const updatedVirtualDOM = {
       tag: oldVirtualDOM.tag,
       attrs: { ...oldVirtualDOM.attrs, ...newVirtualDOM.attrs },
       children: [],
     };

     // 자식 요소의 개수를 비교하여 업데이트
     const oldChildren = oldVirtualDOM.children || [];
     const newChildren = newVirtualDOM.children || [];
     const count = Math.max(oldChildren.length, newChildren.length);
     for (let i = 0; i < count; i++) {
       const oldChild = oldChildren[i];
       const newChild = newChildren[i];

       if (oldChild && !newChild) {
         // 이전에 있던 자식 요소가 새로운 가상 DOM에서 제거되었을 경우
         updatedVirtualDOM.children.push(null);
       } else if (!oldChild && newChild) {
         // 새로 추가된 자식 요소
         updatedVirtualDOM.children.push(newChild);
       } else {
         // 두 자식 요소를 재귀적으로 업데이트
         const updatedChild = updateVirtualDOM(oldChild, newChild);
         updatedVirtualDOM.children.push(updatedChild);
       }
     }

     return updatedVirtualDOM;
   }
   ```

3. 실제 DOM에 변경 사항 반영하기
   가상 DOM을 업데이트한 후, 변경된 부분만 실제 DOM에 반영해야 합니다. 이를 위해 변경된 부분을 식별하고, 이전 상태와 현재 상태를 비교하여 변경이 필요한 부분만 업데이트하는 로직을 작성해야 합니다.

   ```javascript
   // 변경 사항을 실제 DOM에 반영하는 함수
   function updateDOM(element, virtualElement) {
     if (!element) {
       // element가 undefined인 경우, 새로운 요소로 대체
       const newElement = createElement(virtualElement);
       const rootElement = document.getElementById('root');
       rootElement.appendChild(newElement);
       return newElement;
     }

     if (!element.tagName || !virtualElement.tag) {
       return element;
     }

     // 현재 요소와 가상 DOM 요소의 태그 이름이 다르면 전체를 업데이트해야 함
     if (element.tagName.toLowerCase() !== virtualElement.tag.toLowerCase()) {
       // 새로운 요소로 대체
       const newElement = createElement(virtualElement);
       element.parentNode.replaceChild(newElement, element);
       return newElement;
     }

     // 자식 요소 업데이트
     const oldChildren = Array.from(element.childNodes);
     const newChildren = virtualElement.children || [];
     const count = Math.max(oldChildren.length, newChildren.length);
     for (let i = 0; i < count; i++) {
       const oldChild = oldChildren[i];
       const newChild = newChildren[i];

       if (oldChild && !newChild) {
         // 이전에 있던 자식 요소가 새로운 가상 DOM에서 제거되었을 경우
         element.removeChild(oldChild);
       } else if (!oldChild && newChild) {
         // 새로 추가된 자식 요소
         element.appendChild(createElement(newChild));
       } else {
         // 두 자식 요소를 재귀적으로 업데이트
         updateDOM(oldChild, newChild);
       }
     }

     return element;
   }
   ```

위의 로직을 활용하여 `updateVirtualDOM` 함수로 가상 DOM을 업데이트하고, `updateDOM` 함수로 변경 사항을 실제 DOM에 반영할 수 있습니다. 이를 통해 가상 DOM을 효과적으로 관리하고 실제 DOM 조작을 최소화하여 웹 애플리케이션의 성능을 개선할 수 있습니다.

## 가상 DOM 활용하기

가상 DOM을 활용하면 DOM 조작 비용을 줄이고 웹 애플리케이션의 성능을 향상시킬 수 있습니다. 또한, 가상 DOM을 사용하면 JavaScript와 독립적으로 작업할 수 있어 코드 유지보수도 용이해집니다.

이제 Vanilla JavaScript로 가상 DOM을 구현하는 방법에 대해 자세히 알아보았습니다. 이를 통해 웹 애플리케이션의 성능을 향상시키고 유지보수성을 높일 수 있습니다.
