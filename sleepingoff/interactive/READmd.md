# 인터랙티브 웹

## 이미지에 대한 기본 이론

### Vector

- 수학 계산식을 컴퓨터가 렌더링
- 로고, 아이콘 등에 적합
- eps, svg, ai 등

#### svg

- Scalable Vector Graphics
- 벡터 그래픽 파일 형식
- XML 기반의 파일로 메모장과 같은 문서 편집기로 편집 가능
- 크기를 조정해도 품질이 저하되지 않음

### Raster

- 픽셀로 구성
- 사진에 적합
- gif, jpg, png 등

## CSS 기본 이론

### 애니메이션

- 자바스크립트 없이도 애니메이션을 만들고, 스타일 전환을 부드럽게 만들어줌
- 안보이는 요소에 대한 업데이트 주기 조절 등 최적화 가능

- animation의 하위 속성
  - animation-name : 중간 상태를 지정
  - animation-duration : 얼마에 걸쳐 진행될지
  - animation-timing-function : 어떤 시간 간격으로 진행할지
  - animation-delay : 로드 후 언제 시작할지
  - animation-direction : (종료후) 정방향 / 역방향 진행
  - animation-iteration-count : 몇 번 반복될지
  - animation-play-state : 멈춤 / 재생 상태 지정
  - animation-fill-mode : 시작 전 / 애니메이션 종료 후 스타일
  - 축약: anitmation: name duration timing-function ...

```css
@keyframes moveToRight {
  from {
  }
  to {
  }
}

button {
  animation: moveToRight 2s;
  animation-duration: 1s;
  animation-direction: alternate-reverse;
  animation-iteration-count: infinite;
}
```
