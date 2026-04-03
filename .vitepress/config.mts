import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'JAMS Design Guide',
  description: 'BizCenter 디자인 시스템 & 개발 가이드',
  base: '/jams-design-guide/',
  srcDir: '.',
  srcExclude: ['node_modules/**', 'src/**', '.next/**', 'public/**', 'scripts/**'],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '디자인 가이드', link: '/docs/policy/design-guide' },
      { text: '컴포넌트', link: '/docs/components/bzw-components' },
      { text: 'AI 에이전트 레퍼런스', link: '/.claude/docs/design-system' },
    ],

    sidebar: [
      {
        text: '🎨 디자인 정책',
        items: [
          { text: '디자인 가이드', link: '/docs/policy/design-guide' },
          { text: '프로덕트 가이드', link: '/docs/policy/product-guide' },
        ],
      },
      {
        text: '🧩 컴포넌트',
        items: [
          { text: 'BZW 컴포넌트 레퍼런스', link: '/docs/components/bzw-components' },
        ],
      },
      {
        text: '📐 패턴',
        items: [
          { text: '페이지 템플릿', link: '/docs/patterns/page-templates' },
        ],
      },
      {
        text: '🤖 AI 에이전트 레퍼런스',
        collapsed: true,
        items: [
          { text: '디자인 시스템', link: '/.claude/docs/design-system' },
          { text: '기술 스택', link: '/.claude/docs/tech-stack' },
          { text: '코딩 컨벤션', link: '/.claude/docs/coding-conventions' },
          { text: '아키텍처', link: '/.claude/docs/architecture' },
          { text: '컴포넌트 (BZW)', link: '/.claude/docs/components' },
          { text: '디자인 패턴', link: '/.claude/docs/design-patterns' },
        ],
      },
      {
        text: '📋 Claude 설정',
        items: [
          { text: 'CLAUDE.md', link: '/CLAUDE' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/thdduss-stack/jams-design-guide' },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/thdduss-stack/jams-design-guide/edit/master/:path',
      text: 'GitHub에서 수정',
    },

    footer: {
      message: 'JAMS Design Guide',
      copyright: 'JobKorea BizCenter TFT',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
