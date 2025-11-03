# 학급 게시판 웹앱

학생들이 과제나 학습 활동을 사진과 함께 공유하고, 댓글을 통해 소통할 수 있는 학급 게시판 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **File Upload**: Local storage (public/uploads)

## 주요 기능

1. **게시물 작성**: 제목, 내용, 사진과 함께 게시물 업로드
2. **날짜 선택**: 실제 활동한 날짜를 직접 선택 가능 (오늘 날짜가 아니어도 됨)
3. **게시물 목록**: 선택한 날짜 기준으로 최신순 정렬
4. **댓글 기능**: 게시물에 댓글 작성 및 조회
5. **이미지 업로드**: 사진 1장 업로드 및 미리보기

## 시작하기

### 설치

```bash
npm install
```

### 데이터베이스 설정

```bash
npx prisma migrate dev
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
classroom-board/
├── app/
│   ├── api/
│   │   ├── posts/           # 게시물 API
│   │   │   ├── route.ts     # 게시물 목록/생성
│   │   │   └── [id]/
│   │   │       ├── route.ts          # 게시물 상세
│   │   │       └── comments/
│   │   │           └── route.ts      # 댓글 작성
│   │   └── upload/          # 파일 업로드 API
│   │       └── route.ts
│   ├── posts/
│   │   └── [id]/
│   │       └── page.tsx     # 게시물 상세 페이지
│   ├── upload/
│   │   └── page.tsx         # 게시물 작성 페이지
│   ├── layout.tsx           # 레이아웃
│   ├── page.tsx             # 홈페이지 (게시물 목록)
│   └── globals.css          # 전역 스타일
├── lib/
│   ├── prisma.ts            # Prisma 클라이언트
│   └── fileUpload.ts        # 파일 업로드 로직
├── prisma/
│   └── schema.prisma        # 데이터베이스 스키마
└── public/
    └── uploads/             # 업로드된 파일 저장소
```

## 데이터베이스 모델

### Post (게시물)
- `id`: 고유 ID
- `title`: 제목 (선택)
- `description`: 내용/설명 (선택)
- `authorName`: 작성자 이름
- `uploadDate`: 학생이 선택한 날짜 ⭐ (정렬 기준)
- `imageUrl`: 이미지 URL (선택)
- `createdAt`: 실제 생성 시각
- `comments`: 댓글 목록

### Comment (댓글)
- `id`: 고유 ID
- `postId`: 게시물 ID (외래 키)
- `authorName`: 작성자 이름
- `content`: 댓글 내용
- `createdAt`: 작성 시각

## 주요 특징

### uploadDate vs createdAt
- **uploadDate**: 학생이 직접 선택하는 "활동한 날짜" (게시물 정렬 기준)
- **createdAt**: 실제로 DB에 저장된 시각

이 구조를 통해 학생들이 과거의 활동을 나중에 올려도 올바른 날짜로 기록할 수 있습니다.

### 파일 업로드 구조
현재는 로컬 파일 시스템(`public/uploads`)에 저장하지만, `lib/fileUpload.ts` 파일을 수정하여 쉽게 클라우드 스토리지(S3, Supabase 등)로 전환할 수 있도록 설계되었습니다.

## 향후 개선 아이디어

1. **관리자 기능**: 선생님만 게시물을 삭제할 수 있는 권한 추가
2. **학급별 분리**: 여러 학급을 지원하고 학급별로 게시판 분리
3. **다중 파일 업로드**: 한 게시물에 여러 장의 사진 업로드
4. **파일 형식 확장**: 이미지 외에 PDF, HWP 등 다양한 파일 형식 지원
5. **알림 기능**: 새 댓글이나 게시물에 대한 알림
6. **좋아요/반응**: 게시물과 댓글에 좋아요 기능 추가
7. **검색 기능**: 작성자, 제목, 내용으로 게시물 검색
8. **태그/카테고리**: 게시물을 과목이나 주제별로 분류
9. **사용자 인증**: 실제 로그인 시스템 구현 (현재는 이름만 입력)
10. **모바일 앱**: React Native나 Flutter로 모바일 앱 버전 개발

## 배포 시 주의사항

1. 환경 변수 설정 (.env)
2. 데이터베이스 마이그레이션
3. 파일 업로드를 클라우드 스토리지로 전환 권장
4. 이미지 최적화 및 용량 제한

## 라이선스

MIT
