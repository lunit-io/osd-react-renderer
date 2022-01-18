import React from 'react'
import { createTheme } from '@mui/material/styles'
import { TypographyOptions } from '@mui/material/styles/createTypography'

declare module '@mui/material/styles/createTheme' {
  interface Theme {
    appDrawer: {
      width: React.CSSProperties['width']
    }
    subDrawer: {
      width: React.CSSProperties['width']
    }
    toolbar: {
      height: React.CSSProperties['height']
    }
  }
  interface ThemeOptions {
    appDrawer: {
      width: React.CSSProperties['width']
    }
    subDrawer: {
      width: React.CSSProperties['width']
    }
    toolbar: {
      height: React.CSSProperties['height']
    }
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    selected: React.CSSProperties['color']
    primary: React.CSSProperties['color']
    secondary: React.CSSProperties['color']
  }

  interface SlideStatusPalette {
    dot: React.CSSProperties['color']
    contrastText: React.CSSProperties['color']
    main: React.CSSProperties['color']
  }

  interface Palette {
    background: TypeBackground
    scope1: Palette['primary']
    scope2: Palette['primary']
    scope3: Palette['primary']
    scope4: Palette['primary']
    slideStatus: {
      preanalyzing: SlideStatusPalette
      ready: SlideStatusPalette
      analyzing: SlideStatusPalette
      analyzed: SlideStatusPalette
      failed: SlideStatusPalette
    }
    alphaGrey: {
      8: React.CSSProperties['color']
      16: React.CSSProperties['color']
      40: React.CSSProperties['color']
      80: React.CSSProperties['color']
      100: React.CSSProperties['color']
    }
    darkGrey: {
      0: React.CSSProperties['color']
      5: React.CSSProperties['color']
      10: React.CSSProperties['color']
      15: React.CSSProperties['color']
      20: React.CSSProperties['color']
      30: React.CSSProperties['color']
      40: React.CSSProperties['color']
      50: React.CSSProperties['color']
      60: React.CSSProperties['color']
      70: React.CSSProperties['color']
      80: React.CSSProperties['color']
      85: React.CSSProperties['color']
      90: React.CSSProperties['color']
      95: React.CSSProperties['color']
      100: React.CSSProperties['color']
    }
  }
  interface PaletteOptions {
    background?: Partial<TypeBackground>
    scope1?: PaletteOptions['primary']
    scope2?: PaletteOptions['primary']
    scope3?: PaletteOptions['primary']
    scope4?: PaletteOptions['primary']
    preanalyzing?: SlideStatusPalette
    ready?: SlideStatusPalette
    analyzing?: SlideStatusPalette
    analyzed?: SlideStatusPalette
    failed?: SlideStatusPalette
    slideStatus?: {
      preanalyzing: SlideStatusPalette
      ready: SlideStatusPalette
      analyzing: SlideStatusPalette
      analyzed: SlideStatusPalette
      failed: SlideStatusPalette
    }
    alphaGrey?: {
      8: React.CSSProperties['color']
      16: React.CSSProperties['color']
      40: React.CSSProperties['color']
      80: React.CSSProperties['color']
      100: React.CSSProperties['color']
    }
    darkGrey?: {
      0: React.CSSProperties['color']
      5: React.CSSProperties['color']
      10: React.CSSProperties['color']
      15: React.CSSProperties['color']
      20: React.CSSProperties['color']
      30: React.CSSProperties['color']
      40: React.CSSProperties['color']
      50: React.CSSProperties['color']
      60: React.CSSProperties['color']
      70: React.CSSProperties['color']
      80: React.CSSProperties['color']
      85: React.CSSProperties['color']
      90: React.CSSProperties['color']
      95: React.CSSProperties['color']
      100: React.CSSProperties['color']
    }
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    subtitle3: React.CSSProperties
    body3: React.CSSProperties
    body4: React.CSSProperties
    body5: React.CSSProperties
    body6: React.CSSProperties
    caption: React.CSSProperties
    button2: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    subtitle3?: React.CSSProperties
    body3?: React.CSSProperties
    body4?: React.CSSProperties
    body5?: React.CSSProperties
    body6?: React.CSSProperties
    caption?: React.CSSProperties
    button2?: React.CSSProperties
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    scope1: true
    scope2: true
    scope3: true
    scope4: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    subtitle3: true
    body3: true
    body4: true
    body5: true
    body6: true
    caption: true
    button2: true
  }
}

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    subtitle3?: TypographyStyle
    body3?: TypographyStyle
    body4?: TypographyStyle
    body5?: TypographyStyle
    body6?: TypographyStyle
    caption?: TypographyStyle
    button2?: TypographyStyle
  }

  interface TypographyOptions {
    subtitle3?: TypographyStyleOptions
    body3?: TypographyStyleOptions
    body4?: TypographyStyleOptions
    body5?: TypographyStyleOptions
    body6?: TypographyStyleOptions
    caption?: TypographyStyleOptions
    button2?: TypographyStyleOptions
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    preanalyzing: true
    ready: true
    analyzing: true
    analyzed: true
    failed: true
  }
}

const palette = {
  brand: {
    primary: '#7292FD',
    secondary: '#587EFC',
  },
  scope1: '#7292FD',
  scope2: '#587EFC',
  scope3: '#B0C0F4',
  scope4: '#3A5DD9',
  text: {
    primary: '#FFFFFF',
    secondary: '#AFAFB1',
    disabled: '#A8A8A8',
  },
  background: {
    primary: '#1F1F21',
    secondary: '#2D2D2F',
    selected: '#3E3E40',
  },
  alphaGrey: {
    8: 'rgba(134, 148, 177, 0.08)',
    16: 'rgba(134, 148, 177, 0.16)',
    40: 'rgba(134, 148, 177, 0.40)',
    80: 'rgba(134, 148, 177, 0.80)',
    100: '#8694B1',
  },
  slideStatus: {
    preanalyzing: {
      dot: '#9775FA',
      contrastText: '#3612A1',
      main: '#D0BFFF',
    },
    ready: {
      dot: '#748FFC',
      contrastText: '#132A9B',
      main: '#BAC8FF',
    },
    analyzing: {
      dot: '#4DABF7',
      contrastText: '#034480',
      main: '#A5D8FF',
    },
    analyzed: {
      dot: '#3BC9DB',
      contrastText: '#014B58',
      main: '#99E9F2',
    },
    failed: {
      dot: '#FF8787',
      contrastText: '#A60D0D',
      main: '#FFC9C9',
    },
  },
  darkGrey: {
    0: '#FFFFFF',
    5: '#FAFAFB',
    10: '#F1F1F4',
    15: '#D4D4D6',
    20: '#C6C6C8',
    30: '#AFAFB1',
    40: '#99999B',
    50: '#7F7F81',
    60: '#626264',
    70: '#4E4E50',
    80: '#3E3E40',
    85: '#2D2D2F',
    90: '#1F1F21',
    95: '#111113',
    100: '#000000',
  },
  error: {
    main: '#EE5140',
    light: '#EE5140',
    dark: '#EE5140',
  },
  success: {
    main: '#00C9EA',
    light: '#00C9EA',
    dark: '#00C9EA',
  },
  warning: {
    main: '#FFE600',
    light: '#FFE600',
    dark: '#FFE600',
  },
}

const heading = {
  h1: { fontWeight: 500 },
  h2: { fontWeight: 500 },
  h3: { fontWeight: 500 },
  h4: { fontWeight: 500 },
  h5: { fontWeight: 500 },
  h6: { fontWeight: 500 },
}

const html = {
  position: 'fixed',
  overflow: 'hidden',
  fontFamily: `Pretendard, sans-serif`,
}

const body = {
  ...html,
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  lineHeight: 'normal',
  background: '#EAEAEA',
  '& a': {
    textDecoration: 'none',
  },
}

const typographyOptions: TypographyOptions = {
  fontFamily: [
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontSize: 52,
    fontWeight: 'normal',
    lineHeight: '68px',
  },
  h2: {
    fontSize: 38,
    fontWeight: 'bold',
    lineHeight: '48px',
  },
  h3: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '36px',
  },
  h4: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: '18px',
  },
  subtitle1: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '28px',
  },
  subtitle2: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '24px',
  },
  subtitle3: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  },
  body1: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  },
  body2: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: '24px',
  },
  body3: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: '20px',
  },
  body4: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
  },
  body5: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: '20px',
  },
  body6: {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.2px',
  },
  overline: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 600,
    textTransform: 'none',
  },
  button2: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
  },
  caption: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '16px',
  },
}

const theme = createTheme({
  typography: typographyOptions,
  appDrawer: {
    width: 240,
  },
  subDrawer: {
    width: 240,
  },
  toolbar: {
    height: 48,
  },
  palette: {
    mode: 'light',
    primary: {
      main: palette.brand.primary,
    },
    secondary: {
      main: palette.brand.secondary,
    },
    scope1: { main: palette.scope1, contrastText: '#fff' },
    scope2: { main: palette.scope2, contrastText: '#fff' },
    scope3: { main: palette.scope3, contrastText: '#fff' },
    scope4: { main: palette.scope4, contrastText: '#fff' },
    ...palette.slideStatus,
    slideStatus: palette.slideStatus,
    background: {
      default: palette.background.primary,
      secondary: palette.background.secondary,
      selected: palette.background.selected,
    },
    error: palette.error,
    text: palette.text,
    alphaGrey: palette.alphaGrey,
    darkGrey: palette.darkGrey,
    success: palette.success,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html,
        body,
        ...heading,
        '.App': body,
        '#root': body,
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: palette.darkGrey[40],
          borderRadius: 3.5,
        },
        'svg.fixed-color': {
          fill: 'currentColor',
        },
        'svg *:not(.fixed-color)': {
          fill: 'currentColor',
        },
        'svg.MuiCircularProgress-svg *': {
          fill: 'none',
        },
        'svg *.stroke-inherit': {
          fill: 'none',
          stroke: 'currentColor',
        },
        '.snackbarVariantError': {
          background: 'rgba(238, 81, 64, 0.18)',
          border: '1px solid #EE5140',
          ...typographyOptions.body5,
        },
        span: {
          display: 'inline-block',
        },
        '#page-root.drawer-open + .SnackbarContainer-left': {
          left: 260,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          color: palette.text.primary,
          backgroundColor: palette.background.selected,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          padding: '8px 0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          width: 'auto',
          height: '36px',
          padding: '8px 12px',
          ...typographyOptions.body6,
          color: palette.scope1,
          textTransform: 'none',
          '&:hover, &:focus-visible': {
            boxShadow: 'none',
          },
          '&:disabled': {
            background: 'transparent',
            cursor: 'default',
            opacity: 0.3,
          },
        },
        sizeSmall: {
          height: '28px',
          padding: '4px 12px',
        },
        sizeLarge: {
          ...typographyOptions.button,
          height: '44px',
          paddingTop: '10px',
        },
        contained: {
          boxShadow: 'none',
          color: palette.darkGrey[5],
          '&:hover, &:focus-visible': {
            boxShadow: 'none',
          },
          '&:disabled': {
            backgroundColor: palette.scope2,
            opacity: 0.3,
            cursor: 'default',
          },
        },
        containedSizeMedium: {
          padding: '0',
        },
      },
      defaultProps: {
        color: 'secondary',
      },
    },
  },
})
export default theme
