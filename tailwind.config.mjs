/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      base: {
        black: 'var(--palette-base-black)',
        white: 'var(--palette-base-white)',
        dimed: 'var(--palette-base-dimed)',
      },
      gray: {
        50: 'var(--palette-gray-gray50)',
        100: 'var(--palette-gray-gray100)',
        200: 'var(--palette-gray-gray200)',
        250: 'var(--palette-gray-gray250)',
        300: 'var(--palette-gray-gray300)',
        400: 'var(--palette-gray-gray400)',
        500: 'var(--palette-gray-gray500)',
        600: 'var(--palette-gray-gray600)',
        700: 'var(--palette-gray-gray700)',
        800: 'var(--palette-gray-gray800)',
        900: 'var(--palette-gray-gray900)',
        930: 'var(--palette-gray-gray930)',
        950: 'var(--palette-gray-gray950)',
      },
      orange: {
        50: 'var(--palette-orange-orange50)',
        60: 'var(--palette-orange-orange60)',
        70: 'var(--palette-orange-orange70)',
        150: 'var(--palette-orange-orange150)',
        300: 'var(--palette-orange-orange300)',
        350: 'var(--palette-orange-orange350)',
        400: 'var(--palette-orange-orange400)',
        450: 'var(--palette-orange-orange450)',
        500: 'var(--palette-orange-orange500)',
        600: 'var(--palette-orange-orange600)',
        800: 'var(--palette-orange-orange800)',
      },
      blue: {
        50: 'var(--palette-blue-blue50)',
        54: 'var(--palette-blue-blue54)',
        100: 'var(--palette-blue-blue100)',
        150: 'var(--palette-blue-blue150)',
        200: 'var(--palette-blue-blue200)',
        300: 'var(--palette-blue-blue300)',
        400: 'var(--palette-blue-blue400)',
        500: 'var(--palette-blue-blue500)',
        600: 'var(--palette-blue-blue600)',
        650: 'var(--palette-blue-blue650)',
        700: 'var(--palette-blue-blue700)',
        800: 'var(--palette-blue-blue800)',
        850: 'var(--palette-blue-blue850)',
        870: 'var(--palette-blue-blue870)',
        900: 'var(--palette-blue-blue900)',
        950: 'var(--palette-blue-blue950)',
      },
      bluegray: {
        50: 'var(--palette-bluegray-bluegray50)',
        100: 'var(--palette-bluegray-bluegray100)',
        200: 'var(--palette-bluegray-bluegray200)',
        300: 'var(--palette-bluegray-bluegray300)',
        400: 'var(--palette-bluegray-bluegray400)',
        500: 'var(--palette-bluegray-bluegray500)',
        600: 'var(--palette-bluegray-bluegray600)',
        700: 'var(--palette-bluegray-bluegray700)',
        disable: 'var(--palette-bluegray-disable)',
      },
      red: {
        150: 'var(--palette-red-red150)',
        200: 'var(--palette-red-red200)',
        300: 'var(--palette-red-red300)',
        600: 'var(--palette-red-red600)',
        DEFAULT: 'var(--palette-red-red)',
        pink: 'var(--palette-red-pink)',
      },
      green: {
        100: 'var(--palette-green-green100)',
        150: 'var(--palette-green-green150)',
        200: 'var(--palette-green-green200)',
        300: 'var(--palette-green-green300)',
        400: 'var(--palette-green-green400)',
        500: 'var(--palette-green-green500)',
        600: 'var(--palette-green-green600)',
      },
      yellow: {
        50: 'var(--palette-yellow-yellow50)',
        100: 'var(--palette-yellow-yellow100)',
        150: 'var(--palette-yellow-yellow150)',
        300: 'var(--palette-yellow-yellow300)',
        312: 'var(--palette-yellow-yellow312)',
        400: 'var(--palette-yellow-yellow400)',
        500: 'var(--palette-yellow-yellow500)',
        600: 'var(--palette-yellow-yellow600)',
      },
      scrollarea: {
        margin: {
          height: 'var(--scrollarea-margin-height)',
          width: 'var(--scrollarea-margin-width)',
        },
        color: {
          bar: 'var(--scrollarea-color-bar)',
        },
        scroll: {
          width: 'var(--scrollarea-scroll-width)',
          radius: 'var(--scrollarea-scroll-radius)',
        },
        corner: {
          width: 'var(--scrollarea-corner-width)',
          height: 'var(--scrollarea-corner-height)',
        },
      },
      skeleton: {
        color: {
          black: 'var(--skeleton-color-black)',
        },
      },
      violet: {
        150: 'var(--palette-violet-violet150)',
        200: 'var(--palette-violet-violet200)',
        300: 'var(--palette-violet-violet300)',
        600: 'var(--palette-violet-violet600)',
        700: 'var(--palette-violet-violet700)',
        800: 'var(--palette-violet-violet800)',
      },
      subway: {
        line1: 'var(--palette-subway-line1)',
        line2: 'var(--palette-subway-line2)',
        line3: 'var(--palette-subway-line3)',
        line6: 'var(--palette-subway-line6)',
        line5: 'var(--palette-subway-line5)',
        line4: 'var(--palette-subway-line4)',
        lineincheon1: 'var(--palette-subway-lineincheon1)',
        linenewbundang: 'var(--palette-subway-linenewbundang)',
        line9: 'var(--palette-subway-line9)',
        line8: 'var(--palette-subway-line8)',
        linebundang: 'var(--palette-subway-linebundang)',
        line7: 'var(--palette-subway-line7)',
        lineincheon2: 'var(--palette-subway-lineincheon2)',
        lineseohae: 'var(--palette-subway-lineseohae)',
        linegyeonggang: 'var(--palette-subway-linegyeonggang)',
        lineever: 'var(--palette-subway-lineever)',
        lineui: 'var(--palette-subway-lineui)',
        linegyeongchu: 'var(--palette-subway-linegyeongchu)',
        linegyeongui: 'var(--palette-subway-linegyeongui)',
        linegimpogold: 'var(--palette-subway-linegimpogold)',
        lineuijeongbu: 'var(--palette-subway-lineuijeongbu)',
        lineairport: 'var(--palette-subway-lineairport)',
        linedaegu1: 'var(--palette-subway-linedaegu1)',
        linebusangimhae: 'var(--palette-subway-linebusangimhae)',
        linebusan4: 'var(--palette-subway-linebusan4)',
        linebusandonghae: 'var(--palette-subway-linebusandonghae)',
        linebusan2: 'var(--palette-subway-linebusan2)',
        linebusan1: 'var(--palette-subway-linebusan1)',
        linedaegu2: 'var(--palette-subway-linedaegu2)',
        linebusan3: 'var(--palette-subway-linebusan3)',
        linesillim: 'var(--palette-subway-linesillim)',
        linegwangju1: 'var(--palette-subway-linegwangju1)',
        linedaegu3: 'var(--palette-subway-linedaegu3)',
        linedaejeon1: 'var(--palette-subway-linedaejeon1)',
      },
      purple: {
        100: 'var(--palette-purple-purple100)',
        150: 'var(--palette-purple-purple150)',
        200: 'var(--palette-purple-purple200)',
        300: 'var(--palette-purple-purple300)',
        400: 'var(--palette-purple-purple400)',
        500: 'var(--palette-purple-purple500)',
        600: 'var(--palette-purple-purple600)',
        700: 'var(--palette-purple-purple700)',
        800: 'var(--palette-purple-purple800)',
        900: 'var(--palette-purple-purple900)',
        950: 'var(--palette-purple-purple950)',
      },
      pink: {
        100: 'var(--palette-pink-pink100)',
        150: 'var(--palette-pink-pink150)',
        200: 'var(--palette-pink-pink200)',
        300: 'var(--palette-pink-pink300)',
        400: 'var(--palette-pink-pink400)',
        600: 'var(--palette-pink-pink600)',
      },
      indigo: {
        100: 'var(--palette-indigo-indigo100)',
        150: 'var(--palette-indigo-indigo150)',
        200: 'var(--palette-indigo-indigo200)',
        300: 'var(--palette-indigo-indigo300)',
        600: 'var(--palette-indigo-indigo600)',
      },
      brown: {
        150: 'var(--palette-brown-brown150)',
        300: 'var(--palette-brown-brown300)',
        600: 'var(--palette-brown-brown600)',
      },
      olive: {
        100: 'var(--palette-olive-olive100)',
        150: 'var(--palette-olive-olive150)',
        200: 'var(--palette-olive-olive200)',
        300: 'var(--palette-olive-olive300)',
        400: 'var(--palette-olive-olive400)',
        600: 'var(--palette-olive-olive600)',
      },
      mint: {
        100: 'var(--palette-mint-mint100)',
        150: 'var(--palette-mint-mint150)',
        200: 'var(--palette-mint-mint200)',
        300: 'var(--palette-mint-mint300)',
        400: 'var(--palette-mint-mint400)',
        600: 'var(--palette-mint-mint600)',
      },
      transparent32: 'var(--palette-transparent32)',
      transparent24: 'var(--palette-transparent24)',
      transparent20: 'var(--palette-transparent20)',
      transparent16: 'var(--palette-transparent16)',
      transparent12: 'var(--palette-transparent12)',
      transparent8: 'var(--palette-transparent8)',
    },
    spacing: {
      px: '1px',
      0: 'var(--space-space-space0)',
      2: 'var(--space-space-space2)',
      4: 'var(--space-space-space4)',
      6: 'var(--space-space-space6)',
      8: 'var(--space-space-space8)',
      10: 'var(--space-space-space10)',
      12: 'var(--space-space-space12)',
      13: 'var(--space-space-space13)',
      14: 'var(--space-space-space14)',
      16: 'var(--space-space-space16)',
      20: 'var(--space-space-space20)',
      24: 'var(--space-space-space24)',
      28: 'var(--space-space-space28)',
      32: 'var(--space-space-space32)',
      40: 'var(--space-space-space40)',
      48: 'var(--space-space-space48)',
      52: 'var(--space-space-space52)',
      56: 'var(--space-space-space56)',
      60: 'var(--space-space-space60)',
      72: 'var(--space-space-space72)',
      80: 'var(--space-space-space80)',
      '-2': 'var(--space-space-spaceminus2)',
      '-12': 'var(--space-space-spaceminus12)',
      '-1': 'var(--space-space-spaceminus1)',
    },
    borderRadius: {
      0: 'var(--box-radius-radius0)',
      2: 'var(--box-radius-radius2)',
      4: 'var(--box-radius-radius4)',
      6: 'var(--radius-radius-radius6)',
      8: 'var(--box-radius-radius8)',
      12: 'var(--radius-radius-radius12)',
      16: 'var(--box-radius-radius16)',
      20: 'var(--radius-radius-radius20)',
      24: 'var(--radius-radius-radius24)',
      999: 'var(--radius-radius-radius999)',
    },
    fontSize: {
      11: [
        'var(--typography-variant-size11-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size11-lineheight)',
          letterSpacing: 'var(--typography-variant-size11-letterspacing)',
        },
      ],
      12: [
        'var(--typography-variant-size12-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size12-lineheight)',
          letterSpacing: 'var(--typography-variant-size12-letterspacing)',
        },
      ],
      13: [
        'var(--typography-variant-size13-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size13-lineheight)',
          letterSpacing: 'var(--typography-variant-size13-letterspacing)',
        },
      ],
      14: [
        'var(--typography-variant-size14-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size14-lineheight)',
          letterSpacing: 'var(--typography-variant-size14-letterspacing)',
        },
      ],
      15: [
        'var(--typography-variant-size15-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size15-lineheight)',
          letterSpacing: 'var(--typography-variant-size15-letterspacing)',
        },
      ],
      16: [
        'var(--typography-variant-size16-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size16-lineheight)',
          letterSpacing: 'var(--typography-variant-size16-letterspacing)',
        },
      ],
      18: [
        'var(--typography-variant-size18-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size18-lineheight)',
          letterSpacing: 'var(--typography-variant-size18-letterspacing)',
        },
      ],
      20: [
        'var(--typography-variant-size20-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size20-lineheight)',
          letterSpacing: 'var(--typography-variant-size20-letterspacing)',
        },
      ],
      24: [
        'var(--typography-variant-size24-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size24-lineheight)',
          letterSpacing: 'var(--typography-variant-size24-letterspacing)',
        },
      ],
      28: [
        'var(--typography-variant-size28-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size28-lineheight)',
          letterSpacing: 'var(--typography-variant-size28-letterspacing)',
        },
      ],
      32: [
        'var(--typography-variant-size32-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size32-lineheight)',
          letterSpacing: 'var(--typography-variant-size32-letterspacing)',
        },
      ],
      36: [
        'var(--typography-variant-size36-fontsize)',
        {
          lineHeight: 'var(--typography-variant-size36-lineheight)',
          letterSpacing: 'var(--typography-variant-size36-letterspacing)',
        },
      ],
    },
    fontWeight: {
      regular: 'var(--typography-weight-weight400)',
      semibold: 'var(--typography-weight-weight600)',
      bold: 'var(--typography-weight-weight700)',
      medium: 'var(--typography-weight-weight500)',
    },
    extend: {
      animation: {
        'fade-in-scale': 'fadeInScale 0.8s ease-out forwards',
        'loading-bar': 'loadingBar 1.5s ease-in-out infinite',
        'loading-dot': 'loadingDot 1.4s infinite ease-in-out both',
        // Loading 컴포넌트 애니메이션
        'title-fade-in': 'titleFadeIn 0.8s ease-out forwards',
        'title-fade-in-delay': 'titleFadeIn 0.8s ease-out 0.2s forwards',
        'gradient-rotate': 'gradientRotate 8s ease-in-out infinite, gradientColorShift 6s ease-in-out infinite',
        'icon-pulse': 'iconPulse 3s ease-in-out infinite',
        'skeleton-wave': 'skeletonWave 1.8s ease-in-out infinite',
        'skeleton-wave-delay-1': 'skeletonWave 1.8s ease-in-out infinite 0.1s',
        'skeleton-wave-delay-2': 'skeletonWave 1.8s ease-in-out infinite 0.2s',
        'skeleton-wave-delay-3': 'skeletonWave 1.8s ease-in-out infinite 0.3s',
        'skeleton-wave-delay-4': 'skeletonWave 1.8s ease-in-out infinite 0.4s',
        // Prompt 컴포넌트 애니메이션
        'subtle-glow': 'subtleGlow 3s ease-in-out infinite',
        'subtle-glow-delay-1': 'subtleGlow 3s ease-in-out infinite -2.5s',
        'subtle-glow-delay-2': 'subtleGlow 3s ease-in-out infinite -2s',
        'slide-down-fade-in': 'slideDownFadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        loadingBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        loadingDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        // Loading 컴포넌트 keyframes
        titleFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientRotate: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(180deg) scale(1.1)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg) scale(1)' },
        },
        gradientColorShift: {
          '0%, 100%': {
            background:
              'linear-gradient(135deg, rgba(147, 181, 255, 0.4) 0%, rgba(235, 164, 255, 0.4) 50%, rgba(118, 75, 162, 0.4) 100%)',
            opacity: '0.8',
          },
          '33%': {
            background:
              'linear-gradient(135deg, rgba(147, 181, 255, 0.4) 0%, rgba(235, 164, 255, 0.4) 50%, rgba(118, 75, 162, 0.4) 100%)',
            opacity: '1',
          },
          '66%': {
            background:
              'linear-gradient(135deg, rgba(147, 181, 255, 0.4) 0%, rgba(235, 164, 255, 0.4) 50%, rgba(118, 75, 162, 0.4) 100%)',
            opacity: '0.9',
          },
        },
        iconPulse: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.02)' },
        },
        skeletonWave: {
          '0%': { backgroundPosition: '-100% 0', opacity: '0.5' },
          '50%': { opacity: '0.8' },
          '100%': { backgroundPosition: '100% 0', opacity: '0.5' },
        },
        // Prompt 컴포넌트 keyframes
        subtleGlow: {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
          '100%': { opacity: '0.3' },
        },
        slideDownFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        button: {
          color: {
            primary: 'var(--button-color-primary)',
            secondary: 'var(--button-color-secondary)',
            pressed: 'var(--button-color-pressed)',
            accent: 'var(--button-color-accent)',
            accentpressed: 'var(--button-color-accentpressed)',
            primaryhover: 'var(--button-color-primaryhover)',
            secondaryhover: 'var(--button-color-secondaryhover)',
          },
        },
        line: {
          color: {
            primary: 'var(--line-color-primary)',
            secondray: 'var(--line-color-secondray)',
          },
        },
        typography: {
          weight: {
            bold: 'var(--typography-weight-bold)',
            medium: 'var(--typography-weight-medium)',
            regular: 'var(--typography-weight-regular)',
          },
          color: {
            primary: 'var(--typography-color-primary)',
            secondary3: 'var(--typography-color-secondary3)',
            secondary2: 'var(--typography-color-secondary2)',
            secondary4: 'var(--typography-color-secondary4)',
            secondary1: 'var(--typography-color-secondary1)',
            accentpressed: 'var(--typography-color-accentpressed)',
          },
        },
        icon: {
          color: {
            primary: 'var(--icon-color-primary)',
            pink: 'var(--icon-color-pink)',
            yellow: 'var(--icon-color-yellow)',
            secondary: 'var(--icon-color-secondary)',
            accentpressed: 'var(--icon-color-accentpressed)',
            accent: 'var(--icon-color-accent)',
            white: 'var(--icon-color-white)',
            secondary2: 'var(--icon-color-secondary2)',
            blue: 'var(--icon-color-blue)',
          },
        },
        box: {
          fill: {
            gray100: 'var(--box-fill-gray100)',
            gray50: 'var(--box-fill-gray50)',
            assistance1: 'var(--box-fill-assistance1)',
            lightsecondary: 'var(--box-fill-lightsecondary)',
            gradation: 'var(--box-fill-gradation)',
          },
          line: {
            gray300: 'var(--box-line-gray300)',
            gray200: 'var(--box-line-gray200)',
            primary: 'var(--box-line-primary)',
            secondary: 'var(--box-line-secondary)',
          },
        },
        selectbox: {
          hover: {
            focus: 'var(--selectbox-hover-focus)',
          },
        },
        switch: {
          color: {
            active: 'var(--switch-color-active)',
            activeoff: 'var(--switch-color-activeoff)',
          },
          disable: {
            opacity: 'var(--switch-disable-opacity)',
          },
        },
        checkbox: {
          color: {
            primary: 'var(--checkbox-color-primary)',
            disable: 'var(--checkbox-color-disable)',
          },
        },
        radio: {
          color: {
            primary: 'var(--radio-color-primary)',
            disabled: 'var(--radio-color-disabled)',
          },
        },
        bullet: {
          color: {
            default: 'var(--bullet-color-default)',
            secondary: 'var(--bullet-color-secondary)',
          },
        },
        tabs: {
          color: {
            primary: 'var(--tabs-color-primary)',
          },
        },
        chipsecondary: {
          line: {
            lightprimary: 'var(--chipsecondary-line-lightprimary)',
            lightaccent: 'var(--chipsecondary-line-lightaccent)',
            ligtsecondary1: 'var(--chipsecondary-line-ligtsecondary1)',
            ligtsecondary2: 'var(--chipsecondary-line-ligtsecondary2)',
            ligtsecondary3: 'var(--chipsecondary-line-ligtsecondary3)',
            lightgray: 'var(--chipsecondary-line-lightgray)',
            lightred: 'var(--chipsecondary-line-lightred)',
            primary: 'var(--chipsecondary-line-primary)',
            accent: 'var(--chipsecondary-line-accent)',
            secondary1: 'var(--chipsecondary-line-secondary1)',
            secondary2: 'var(--chipsecondary-line-secondary2)',
            secondary3: 'var(--chipsecondary-line-secondary3)',
            red: 'var(--chipsecondary-line-red)',
            black: 'var(--chipsecondary-line-black)',
          },
          color: {
            primary: 'var(--chipsecondary-color-primary)',
            accent: 'var(--chipsecondary-color-accent)',
            secondary1: 'var(--chipsecondary-color-secondary1)',
            secondary2: 'var(--chipsecondary-color-secondary2)',
            secondary3: 'var(--chipsecondary-color-secondary3)',
            bgprimary: 'var(--chipsecondary-color-bgprimary)',
            bgsecondary1: 'var(--chipsecondary-color-bgsecondary1)',
            bgsecondary2: 'var(--chipsecondary-color-bgsecondary2)',
            bgsecondary3: 'var(--chipsecondary-color-bgsecondary3)',
            bgaccent: 'var(--chipsecondary-color-bgaccent)',
            red: 'var(--chipsecondary-color-red)',
            bgsecondary4: 'var(--chipsecondary-color-bgsecondary4)',
          },
        },
        newdot: {
          color: {
            primary: 'var(--newdot-color-primary)',
          },
        },
        bottomsheet: {
          whiteshadow: {
            endcolor: 'var(--bottomsheet-whiteshadow-endcolor)',
            startcolor: 'var(--bottomsheet-whiteshadow-startcolor)',
          },
          grayshadow: {
            endcolor: 'var(--bottomsheet-grayshadow-endcolor)',
            startcolor: 'var(--bottomsheet-grayshadow-startcolor)',
          },
        },
        modal: {
          height: {
            top: 'var(--modal-height-top)',
          },
        },
        chipprimary: {
          color: {
            primary: 'var(--chipprimary-color-primary)',
            secondary2: 'var(--chipprimary-color-secondary2)',
            accent: 'var(--chipprimary-color-accent)',
            secondary1: 'var(--chipprimary-color-secondary1)',
            secondarysmall2: 'var(--chipprimary-color-secondarysmall2)',
            secondarysmall1: 'var(--chipprimary-color-secondarysmall1)',
          },
        },
        tooltip: {
          color: {
            primary: 'var(--tooltip-color-primary)',
          },
        },
        datepicker: {
          color: {
            on: 'var(--datepicker-color-on)',
            bg: 'var(--datepicker-color-bg)',
          },
        },
        slider: {
          color: {
            primary: 'var(--slider-color-primary)',
            secondary: 'var(--slider-color-secondary)',
          },
        },
        togglegroupitem: {
          color: {
            primaryline: 'var(--togglegroupitem-color-primaryline)',
          },
        },
        tag: {
          color: {
            gray: 'var(--tag-color-gray)',
            primary: 'var(--tag-color-primary)',
          },
          radius: {
            primary: 'var(--tag-radius-primary)',
          },
        },
        filllinebutton: {
          fill: {
            primary: 'var(--filllinebutton-fill-primary)',
            secondery: 'var(--filllinebutton-fill-secondery)',
          },
          line: {
            primary: 'var(--filllinebutton-line-primary)',
            secondery: 'var(--filllinebutton-line-secondery)',
            primaryhover: 'var(--filllinebutton-line-primaryhover)',
            seconderyhover: 'var(--filllinebutton-line-seconderyhover)',
          },
        },
        separator: {
          color: {
            primary: 'var(--separator-color-primary)',
          },
        },
        form: {
          color: {
            primary: 'var(--form-color-primary)',
          },
        },
      },
      boxShadow: {
        white: 'var(--shadow-white-x) var(--shadow-white-y) var(--shadow-white-blur) var(--shadow-white-color)',
        gray: 'var(--shadow-gray-x) var(--shadow-gray-y) var(--shadow-gray-blur) var(--shadow-gray-color)',
        smallbox:
          'var(--shadow-smallbox-x) var(--shadow-smallbox-y) var(--shadow-smallbox-blur) var(--shadow-smallbox-color)',
        dropdown:
          'var(--shadow-dropdown-x) var(--shadow-dropdown-y) var(--shadow-dropdown-blur) var(--shadow-dropdown-color)',
        'switch-medium':
          'var(--switch-shadow-medium-x) var(--switch-shadow-medium-y) var(--switch-shadow-medium-blur) var(--switch-shadow-medium-color)',
        'switch-small':
          'var(--switch-shadow-small-x) var(--switch-shadow-small-y) var(--switch-shadow-small-blur) var(--switch-shadow-small-color)',
        'tooltip-shadow-default':
          'var(--tooltip-shadow-shadow-default-x) var(--tooltip-shadow-shadow-default-y) var(--tooltip-shadow-shadow-default-blur) var(--tooltip-shadow-shadow-default-color)',
        'tooltip-shadow-box':
          'var(--tooltip-shadow-shadow-box-x) var(--tooltip-shadow-shadow-box-y) var(--tooltip-shadow-shadow-box-blur) var(--tooltip-shadow-shadow-box-color)',
        button: 'var(--shadow-button-x) var(--shadow-button-y) var(--shadow-button-blur) var(--shadow-button-color)',
        large: 'var(--shadow-large-x) var(--shadow-large-y) var(--shadow-large-blur) var(--shadow-large-color)',
        list: 'var(--shadow-list-x) var(--shadow-list-y) var(--shadow-list-blur) var(--shadow-list-color)',
      },
    },
  },
};
