Matter.js https://brm.io/matter-js/

## Engine

- 물리 시뮬레이션 담당
- Body들의 list들을 관리
- Body 들의 위치, 속도, 충돌 등을 계산
- gravity, enableSleeping, positionIterations...

## Render

- Body 들의 시각적인 부분을 담당
- canvas, canvas의 기본 세팅들
- 디버깅 도구들

## Runner

- Engine, Render의 업데이트 loop 관리
- beforeTick, tick, afterTick
- fps, requestAnimationFrame(frame)

## Body

- 단일 물리적 객체(시각적 x)
- 한 객체의 position, velocity, force, mass...

## Bodies

- 물리값만 가진 Body를 시각적으로 쉽게 표현하기 위한 모듈

## Composite

- world에 body를 추가해주는 역할
- 또는 Body들을 하나로 묶는 그룹의 역할도 가능
