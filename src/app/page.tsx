import Client from './client';

/**
 * 루트 페이지 컴포넌트
 * 로그인 상태에 따라 적절한 워크스페이스 페이지로 리다이렉트
 *
 * @description
 * - 미들웨어에서 인증 체크 완료 (비로그인 시 잡코리아 로그인으로 리다이렉트)
 * - 로그인 + workspaceId 있음: /workspace/{workspaceId}로 리다이렉트
 * - 로그인 + workspaceId 없음: /workspace/on-boarding으로 리다이렉트
 */
export default async function RootPage() {
  return <Client />;
}


