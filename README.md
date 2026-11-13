# Todo API

> NestJS로 만든, 메모리에 저장하는 할 일 관리 REST API (등록·조회·완료·삭제)

NestJS 기반의 간단한 할 일(Task) 관리 REST API입니다. 할 일을 등록·조회·완료 처리·삭제할 수 있으며, 데이터는 별도 DB 없이 메모리에 저장됩니다(서버를 재시작하면 초기화).

## 요구 사항

- **Node.js 24 이상** (개발 환경: v24.21.0, `@types/node` 24 기준)
- npm (Node.js에 포함)
- 프로젝트는 ESM(`"type": "module"`)으로 구성되어 있습니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 (파일 변경 감지)
npm run start:dev

# 일반 실행
npm run start

# 프로덕션 빌드 후 실행
npm run build
npm run start:prod
```

서버는 기본적으로 `http://localhost:3000`에서 실행되며, `PORT` 환경 변수로 포트를 변경할 수 있습니다.

```bash
PORT=8080 npm run start
```

## 테스트

```bash
# 단위 테스트
npm run test

# 변경 감지 모드
npm run test:watch

# e2e 테스트
npm run test:e2e

# 커버리지
npm run test:cov

# 린트
npm run lint
```

## 엔드포인트

| 메서드 | 경로 | 설명 | 요청 본문 | 응답 |
| ------ | ---- | ---- | --------- | ---- |
| GET | `/` | 기본 인사 메시지 | - | 문자열 |
| POST | `/tasks` | 할 일 생성 | `{ "title": "string" }` | 생성된 할 일 |
| GET | `/tasks` | 할 일 전체 조회 | - | 할 일 배열 |
| GET | `/tasks/:id` | 할 일 단건 조회 | - | `id`, `title`, `status`, `createdAt` |
| PATCH | `/tasks/:id/complete` | 할 일 완료 처리 | - | 완료된 할 일 |
| DELETE | `/tasks/:id` | 할 일 삭제 | - | 없음 |

### 할 일 객체

```json
{
  "id": 1,
  "title": "우유 사기",
  "status": "todo",
  "createdAt": "2026-11-13T00:00:00.000Z"
}
```

`status`는 `todo`(기본값) 또는 `done`입니다.

### 사용 예시

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"우유 사기"}'
curl http://localhost:3000/tasks
curl -X PATCH http://localhost:3000/tasks/1/complete
curl -X DELETE http://localhost:3000/tasks/1
```
