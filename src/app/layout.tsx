import Script from 'next/script';
import './globals.css';
import './jds-reset.css';
import './design-tokens.css';
import '@jds/theme/theme.css';
import '@jds/theme/pretendard.css';
import '@jk/react-pc/react-pc.css';
import 'ckeditor5/ckeditor5.css';
import { ThemeProvider } from '@jds/theme';

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-brand-theme='jk' data-theme='light' lang='ko' suppressHydrationWarning>
      <head translate='no'>
        {globalThis?.process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin='anonymous'
            src='//unpkg.com/react-grab/dist/index.global.js'
            strategy='beforeInteractive'
          />
        )}
        {globalThis?.process.env.NODE_ENV === 'development' && (
          <Script src='//unpkg.com/@react-grab/claude-code/dist/client.global.js' strategy='lazyOnload' />
        )}

        {globalThis?.process.env.NEXT_PUBLIC_SHORT_ENV === 'LOC' && (
          <link
            as='style'
            crossOrigin='anonymous'
            href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css'
            rel='stylesheet'
          />
        )}
        <link
          crossOrigin='anonymous'
          href={`${process.env.NEXT_PUBLIC_ASSETS_CF}/hiringcenter/assets/styles/editor-styles.css`}
          rel='stylesheet'
        />
      </head>
      <body>
        <ThemeProvider theme='jobkorea'>{children}</ThemeProvider>
      </body>
    </html>
  );
}
