import React from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import AppNav from '../AppNav'

interface DefaultLayoutProps {
  children: React.ReactNode
}

const LayoutBox = styled(Box)({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  zIndex: 1,
  overflow: 'hidden',
  position: 'absolute',
  flexGrow: 1,
})

export default function DefaultLayout({
  children,
}: DefaultLayoutProps): JSX.Element {
  return (
    <LayoutBox>
      <AppNav />
      <Box
        component="main"
        sx={{
          display: 'flex',
          width: '100%',
          flex: '1 1 auto',
          background: theme => theme.palette.darkGrey[0],
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          boxShadow: '0px 0px 10px 0px rgb(0 0 0 / 25%)',
        }}
      >
        {children}
      </Box>
    </LayoutBox>
  )
}
