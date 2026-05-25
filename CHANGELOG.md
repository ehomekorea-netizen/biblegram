# 📜 Biblegram 개발 변경 이력 (CHANGELOG)

> 바이블그램 PWA 서비스의 전체 개발 이력을 기록합니다.
> 형식: [Conventional Commits](https://www.conventionalcommits.org/) 기반

---

## [v1.6] - 2026-05-25 (오후)
### ✨ Added
- **아침 7시 푸시 알림 시스템** (`api/morning-push.js`)
  - 아침 묵상 권유 메시지 5종 랜덤 발송
  - Web Push API + VAPID 인증 기반
- **cron-job.org 외부 스케줄러 연동**
  - Vercel Hobby 플랜 cron 미지원 → 외부 무료 서비스로 대체

### 🔄 Changed
- **저녁 푸시 시간**: 21:47 → **21:00** (오후 9시 정각)
- **활동 알림 기준**: 카드 10개마다 → **5개마다** (초기 서비스 활성화 목적)
- `vercel.json` cron 스케줄 동기화 업데이트

### 📝 관련 파일
- `api/morning-push.js` [NEW]
- `api/cron-push.js` (시간 변경)
- `api/activity-push.js` (기준 5개로 변경)
- `vercel.json` (cron 스케줄 2개 등록)

> **커밋**: `4e2ad8d` feat: add morning 7AM push, update evening to 9PM, lower activity threshold to 5 posts

---

## [v1.5] - 2026-05-25 (저녁)
### ✨ Added
- **3D 신화적 스플래시 오프닝 화면** (Method B)
  - 우주 별빛 배경 + 반짝이는 별 파티클 시스템
  - 3D 골드 성경책 오프닝 애니메이션 (펼쳐지는 모션)
  - 황금빛 코즈믹 더스트 상승 파티클
  - Lora 세리프 폰트 로고 "Biblegram⁺"
  - 우측 정렬 한글 고딕 부제 "바이블그램"
  - 전체 3.8초 인트로 → 페이드아웃 트랜지션
- **매일 저녁 9:47 PM 자동 푸시 알림** (`api/cron-push.js`)
  - Supabase push_subscriptions 테이블 기반 구독자 전체 발송
  - 저녁 은혜 메시지 5종 랜덤 선택
  - 만료 구독 자동 삭제 (410/404 에러 시)
- **활동 기반 푸시 알림** (`api/activity-push.js`)
  - 카드 누적 10개 단위 마일스톤 달성 시 전체 발송
  - 작성자 본인 제외 발송 로직
  - 활동 메시지 4종 랜덤 선택
- **PWA Service Worker 푸시 수신 핸들러** (`public/sw.js`)
  - Background push 이벤트 리스너
  - Unsplash 이미지 썸네일 최적화 (JPG 변환, 200px 리사이즈)
  - 알림 클릭 시 딥링크 네비게이션 (카드 ID 기반)
  - 기존 탭 포커싱 또는 새 탭 오픈 분기 처리

### 📝 관련 파일
- `api/cron-push.js` [NEW]
- `api/activity-push.js` [NEW]
- `public/sw.js` (push 핸들러 추가)
- `src/App.jsx` (SplashView 전면 교체)
- `vercel.json` (cron 스케줄 등록)

> **커밋**: `7ace6ed` feat: implement 3D space splash screen, 9:47 PM daily scheduled push, and 10-posts activity triggered push

---

## [v1.4] - 2026-05-24 (자정)
### ✨ Added
- **초강력 순차 카드 생성 시스템**
  - 프로그레시브 로딩 UI (단계별 진행률 표시)
  - 순차적 카드 생성 파이프라인 (병렬 → 순차로 변경)
  - 생성 실패 시 자동 재시도 메커니즘

### 🐛 Fixed
- 카드 생성 시 **화면 블랙아웃(암전) 현상** 수정
- 프로필 탭 필터 로직 구조 개선

### 📝 관련 파일
- `src/App.jsx` (카드 생성 흐름 전면 재구성)

> **커밋**: `0e98c76` feat: implement extremely robust sequential card creation with progressive loading
> **커밋**: `cbf12b8` fix: blackout on card creation and restructure profile tab filter logic

---

## [v1.3] - 2026-05-23 (심야)
### ✨ Added (Phase 2)
- **당겨서 새로고침 (Pull-to-Refresh)** 제스처
- **피드에서 본인 카드 숨기기** 기능
- **공유 카운터 오버레이** 전면 리라이팅 (1인 1회 제한)

### ✨ Added (Phase 1)
- **성경 말씀 오버레이** 표시 기능
- **글로벌 음소거** 토글 (TTS 전체 끄기)
- **컴팩트 저작권 배너** (간결한 하단 표시)
- **설정 업데이트 모달** UI

### ✨ Added (기타)
- **Q14**: 성경 구절 입력 가드 (유효성 검증)
- **Q15**: 라이브러리(서재) 구조 전면 재편

### 📝 관련 파일
- `src/App.jsx` (피드, 프로필, 설정 등 다수 컴포넌트)

> **커밋**: `a6de98f` feat: implement Phase 2
> **커밋**: `53872fe` feat: implement Phase 1
> **커밋**: `fcef756` feat: Q14 Bible reference input guard and Q15 Library restructuring

---

## [v1.2] - 2026-05-23 (오후)
### ✨ Added
- **큰글씨 보기 버튼** (성경 카드 생성 화면 내)
- **네이티브 대형 폰트 스케일링** (카드 생성 플로우 전용)
  - 기본: 제목 23px / 큰글씨: 제목 27px 비례 스케일
- **TTS 미리보기 자동재생** Web Speech API 폴백 처리

### 🔄 Changed
- **라이브러리 프로필 텍스트 크기 업스케일**
  - 닉네임, 설명, 탭 통계, 서브섹션, 도움말, 저작권 배너 전체 조정
- **카드 생성 화면 JSX** 100% 리액티브 상태 기반 폰트 사이징으로 리팩토링
- 큰글씨 토글을 **카드 생성 화면에만 제한** (설정 모달에서 제거)
- 1단계(Step 1) 설명 줄바꿈 처리

### 📝 관련 파일
- `src/App.jsx` (CreateView, LibraryView, SettingsModal 등)

> **커밋**: `04288a5` ~ `9b56a68` (6개 연속 커밋)

---

## [v1.1] - 2026-05-23 (오전)
### ✨ Added
- **설정 모달 최적화** (대형 폰트 세그먼트 컨트롤)
- **카카오 연동 상태 표시** (노란색 연결 인디케이터)
- **카드 삭제 기능** (본인 카드 삭제)
- **카카오 프로필 동기화** (카카오 로그인 시 프로필 사진/닉네임 자동 반영)
- **컴팩트 라이브러리 레이아웃** (프로필 탭 공간 효율화)
- **다이나믹 카드 로테이션 알고리즘** (피드 카드 정렬 최적화)
- **모바일 줌 방지** (핀치 줌 차단)
- **Web Speech API 자동재생 폴백** (TTS 음성 합성)
- **스레드형 댓글 시스템** (대댓글 지원)
- **댓글 롱프레스 삭제** (본인 댓글 길게 눌러 삭제)
- **댓글 수 실시간 동기화** (카드별 댓글 카운트 연동)

### 🐛 Fixed
- Safe Area 레이아웃 클리핑 오류 수정
- 오버레이 간격 조정 (상단 이동)
- 프로필 상단 헤더 충돌 해결

### 📝 관련 파일
- `src/App.jsx` (전체 컴포넌트)

> **커밋**: `480221e` ~ `7083914` (5개 연속 커밋)

---

## [v1.0] - 2026-05-21
### 🎉 초기 릴리즈
- **Biblegram PWA 첫 배포**
- React + Vite 기반 SPA (Single Page Application)
- Supabase 백엔드 (인증, DB, 스토리지)
- 카카오 로그인 연동
- 말씀 카드 생성 (Gemini AI + Unsplash 이미지)
- 피드 타임라인 (좋아요, 댓글, 공유)
- 프로필 라이브러리 (내 카드 모아보기)
- PWA 설치 지원 (오프라인 캐싱)
- TTS 말씀 음성 읽기

### 📝 관련 파일
- 프로젝트 전체 초기 업로드

> **커밋**: `4d2758e` ~ `a0cb023` (초기 업로드 3개 커밋)

---

## 🏗️ 기술 스택

| 분류 | 기술 |
|------|------|
| **프론트엔드** | React 19 + Vite 5 |
| **스타일링** | Tailwind CSS + 인라인 스타일 |
| **백엔드** | Supabase (PostgreSQL + Auth + Storage) |
| **API 서버** | Vercel Serverless Functions |
| **AI** | Google Gemini API (말씀 카드 생성) |
| **이미지** | Unsplash API (배경 이미지) |
| **인증** | 카카오 OAuth 2.0 |
| **푸시 알림** | Web Push API + VAPID |
| **스케줄러** | cron-job.org (외부 무료) |
| **배포** | Vercel (Hobby Plan) |
| **버전 관리** | Git + GitHub |

---

## 📂 프로젝트 구조

```
biblegram/
├── api/                          # Vercel Serverless API
│   ├── cron-push.js              # 매일 저녁 9시 푸시 알림
│   ├── morning-push.js           # 매일 아침 7시 푸시 알림
│   ├── activity-push.js          # 카드 5개 단위 활동 알림
│   ├── generate.js               # AI 말씀 카드 생성 API
│   └── kakao-login.js            # 카카오 로그인 콜백
├── public/
│   ├── sw.js                     # PWA Service Worker
│   ├── manifest.json             # PWA 매니페스트
│   └── icons/                    # 앱 아이콘
├── src/
│   └── App.jsx                   # 메인 앱 (단일 파일 아키텍처)
├── vercel.json                   # Vercel 배포 + cron 설정
└── package.json                  # 의존성 관리
```

---

## 📊 개발 통계

| 항목 | 수치 |
|------|------|
| **총 커밋 수** | 20개 |
| **개발 기간** | 2026-05-21 ~ 현재 (5일차) |
| **주요 기능** | 15개+ |
| **API 엔드포인트** | 4개 |
| **푸시 메시지 종류** | 14종 (아침 5 + 저녁 5 + 활동 4) |
