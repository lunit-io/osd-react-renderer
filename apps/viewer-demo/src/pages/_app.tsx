import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '../styles/globals.css'
import theme from '../styles/theme'
import DefaultLayout from '../components/DefaultLayout'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>@lunit/osd-react-renderer docs</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="stylesheet"
          href="https://static.lunit.io/fonts/pretendard/pretendard.css"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </ThemeProvider>
    </>
  )
}

export default MyApp
