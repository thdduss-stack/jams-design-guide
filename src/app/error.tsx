'use client';

import { usePathname } from 'next/navigation';
    
const Error = () => {
  const pathname = usePathname();

  // workspace 경로인 경우 ErrorWrapper 사용
  if (pathname?.startsWith('/workspace')) {
    return <p>workspace error</p>;
  }

  // 그 외 경로는 기존 에러 페이지 사용
  return <p>error</p>;
};

export default Error;
