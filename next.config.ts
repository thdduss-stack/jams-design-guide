import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    '/api/kmc/verify': ['./src/app/api/kmc/kmcert-ca.pem'],
  },
  experimental: {
    optimizePackageImports: [
      '@jds/theme',
      '@jds/tabs',
      '@jds/helper-utils',
      '@jds/helper-fetchs',
      '@jds/alert-dialog',
      '@jds/carousel',
      '@jds/checkbox',
      '@jds/context',
      '@jds/dialog',
      '@jds/popover',
      '@jds/select',
      '@jds/toast',
      '@jds/toggle',
      '@jds/toggle-group',
      '@jds/tooltip',
      '@jds/visually-hidden',
      // @jk packages
      '@jk/react-pc',
      '@jk/react-share',
      // tanstack
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      // dnd-kit
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      // fullcalendar
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction',
      // other libraries
      'react-hook-form',
      'zustand',
      'zod',
      'recharts',
      'dayjs',
      'clsx',
      'tailwind-merge',
      'ag-grid-react',
      'ag-grid-community',
    ],
  },
  env: {
    PM_CONFIG_API_URL: process.env.PM_CONFIG_API_URL || '',
    SHORT_ENV: process.env.SHORT_ENV || '',
  },
  webpack: (config, { isServer }) => {
    // webpack 캐시 직렬화 경고 숨기기 (big strings 관련)
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
    };

    // react-pdf 브라우저 번들 충돌 방지
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };

    // pdfjs-dist를 클라이언트에서만 처리
    if (!isServer) {
      // pdfjs-dist ESM 모듈 처리
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];

      // .mjs 파일을 제대로 처리하도록 설정
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });

      // pdfjs-dist 모듈의 exports를 무시
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
  images: {
    remotePatterns: [
      { hostname: 'yellow.contentsfeed.com', protocol: 'https' },
      { hostname: '*.jobkorea.co.kr', protocol: 'https' },
      // 잡코리아 프로필 이미지 서버
      { hostname: 'jts-file2.jobkorea.co.kr', protocol: 'https' },
      // imgraph CloudFront 도메인 (워크스페이스 이미지)
      { hostname: 'imagraph.dev.jobkorea.co.kr', protocol: 'https' },
      { hostname: 'imagraph.stg.jobkorea.co.kr', protocol: 'https' },
      { hostname: 'imagraph.jobkorea.co.kr', protocol: 'https' },
      { hostname: 'contents.albamon.kr', protocol: 'https' },
      // 알바몬 프로필 이미지 서버
      { hostname: 'test-file.albamon.com', protocol: 'https' },
      { hostname: 'file.albamon.com', protocol: 'https' },
      { hostname: 'jts1-file.albamon.com', protocol: 'https' },
      { hostname: 'placehold.co', protocol: 'https' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Document-Policy', value: 'js-profiling' }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/bizcenter/api/:path*',
        destination: `/api/bizcenter/:path*`,
      },
      {
        source: '/bizcenter/:path*',
        destination: '/assets/:path*',
      },
    ];
  },
  productionBrowserSourceMaps: true,
};


export default nextConfig;
