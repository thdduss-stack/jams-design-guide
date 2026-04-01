## Getting Started

- [node](https://nodejs.org/ko/download) 설치
- [pnpm](https://pnpm.io/installation) 설치
- node module 설치

```command
pnpm install --frozen-lockfile
```

- 패키지 빌드

```command
pnpm build
```

## Host Config

ssl 인증서 설정

```
brew install mkcert
# FireFox 사용 시 nss 설치
brew install nss

pnpm run cert

또는


mkdir cert
cd cert

# 아래 명령어 실행 이후 브라우저 전체 재시작 필요
mkcert -install
# local.sample.co.kr
mkcert -key-file local-key.pem -cert-file local-cert.pem bizcenter.jobkorea.co.kr hiringcenter.local.jobkorea.co.kr
```

## 프로젝트 기본 정보

### STACKS

---

![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-0078d7?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-%23000000?style=for-the-badge&logo=intellij-idea&logoColor=white)
![TurboRepo](https://img.shields.io/badge/TurboRepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![HTML](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Css](https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white)
![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Storybook](https://img.shields.io/badge/storybook-FF4785?style=for-the-badge&logo=Storybook&logoColor=white)
![NextJs](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
![Node JS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=whit)
![Git Lab](https://img.shields.io/badge/gitlab-F05032?style=for-the-badge&logo=gitlab&logoColor=#FC6D26)
![Bash](https://img.shields.io/badge/BASH-F15A24?style=for-the-badge&logo=Zsh&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white)
<br>
<br>

### 🚨 Coding Convention

| 항목                    | 링크                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Eslint Rule**         | [@jds/config-eslint](https://git.jobkorea.co.kr/frontend-core-system/jds/-/blob/master/packages/config/eslint/src/index.js?ref_type=heads)      |
| **Prettier Formatter**  | [@jds/config-prettier](https://git.jobkorea.co.kr/frontend-core-system/jds/-/blob/master/packages/config/prettier/src/index.js?ref_type=heads)  |
| **Typescript Compiler** | [@jds/config-typescript](https://git.jobkorea.co.kr/frontend-core-system/jds/-/blob/master/packages/config/typescript/base.json?ref_type=heads) |
| **Git**                 | [Git 브랜치 전략](https://wiki.jobkorea.co.kr/pages/viewpage.action?pageId=568066673)                                                           |

### 🚨 Git Commit Convention

---

### 구조

- body 와 footer 는 생략 가능

```
type: Subject

body

footer
```

### Type

- 타입은 소문자

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷 변경, 세미콜론 누락, 코드 수정이 없는 경우
modify: 기존 코드의 기능을 추가하거나 변경
refactor: 중복 코드 제거나 변수명 변경, 가독성 향상 등 기존 코드 개선
test: 테스트 코드. 리펙토링 테스트 코드를 추가한 경우
chore: 빌드 업무 수정, 패키지 매니저 수정
remove: 파일 및 코드 삭제
rename: 파일 및 코드명 변경
```

### Subject

- 제목. 코드 변경사항에 대한 짧은 요약
- 마침표 및 특수 기호는 사용하지 않음
- 영문으로 표기하는 경우 동사를 가장 앞에 두고 첫 글자는 대문자로 표기

```
Add: 코드나 테스트, 예제, 문서등의 파일 생성이 있는 경우
Update: 라이브러리, 프레임워크등의 업데이트가 있는 경우
Simplify: 복잡한 코드를 단순화 하는 작업
Comment: 주석 추가 및 변경
Move: 코드 이동
```

### Body

- 한 줄에 72자 이내로 작성
- 어떻게 보다는 무엇을, 왜 변경했는지를 작성
- 최대한 자세히 작성

### Footer

- issue tracker id 를 명시할 때 사용
- 여러 개의 이슈를 참조할 때는 콤마로 구분하여 사용

```
Fixes: 이슈 수정 중
Resolves: 이슈를 해결했을 때
Ref: 참고할 이슈가 있을 때
Related to: 해당 커밋에 관련된 이슈가 있을 때
```

### e.g)

```
feat: Add login page

or

feat: 로그인 페이지 추가

or

feat: 로그인 기능 구현

로그인 시 토큰 정보를 스토어에 저장

Resolves: Global-12676
Ref: Global-123
Related to: Global-234, Global-435
```

<br>
<br>

### 🤖 AI 코드 어시스턴트 정책

---

이 프로젝트는 AI 코드 어시스턴트(예: Cursor, GitHub Copilot 등)를 활용하여 개발 효율을 높이고 있습니다.

#### 문서 생성 정책

- **AI는 명시적인 요청 없이 문서 파일(\*.md)을 자동으로 생성하지 않습니다**
- 문서가 필요한 경우, 개발자가 명확히 요청해야 합니다
- 이 정책은 불필요한 문서 증식을 방지하고, 문서의 일관성을 유지하기 위함입니다

<br>
<br>

### Document Navigation

---

<br />

| 항목                    | 링크                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Eslint Rule**         | [@jds/config-eslint](https://git.jobkorea.co.kr/frontend-core-system/jds/-/blob/master/packages/config/eslint/src/index.js?ref_type=heads)      |
| **Prettier Formatter**  | [@jds/config-prettier](https://git.jobkorea.co.kr/frontend-core-system/jds/-/blob/master/packages/config/prettier/src/index.js?ref_type=heads)  |
| **Typescript Compiler** | [@jds/config-typescript](https://git.jobkorea.co.kr/frontend-core-system/jds/-/blob/master/packages/config/typescript/base.json?ref_type=heads) |
| **Git**                 | [Git 브랜치 전략](https://wiki.jobkorea.co.kr/pages/viewpage.action?pageId=568066673)                                                           |

<br>
<br>

<br>
<br>

### 프로젝트 구조

### Package

```command
pnpm install --frozen-lockfile
```

패키지가 업데이트되거나, 최초 실행 시 위 명령어로 패키지 설치가 필요합니다.

```command
pnpm store prune
pnpm clean
```

or

```command
pnpm clear-install
```

패키지가 꼬여 빌드 등이 되지 않을 땐 위 명령어로 정리할 수 있습니다.

모든 패키지는 [TypeScript](https://www.typescriptlang.org/)를 사용합니다.

의존성 추가 및 삭제는 다음 명령을 통해 진행할수있습니다

```command
pnpm add $PACKAGE_NAME
pnpm remove $PACKAGE_NAME
or
pnpm add -D $PACKAGE_NAME

# Example
pnpm add -D react
pnpm remove react
```
