import { Box, Typography, styled } from '@mui/material'
import React from 'react'

export const Container = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  padding: '8px',
  '& .navigator': {
    width: '160px !important',
    height: '160px !important',
    border: 'solid 1px rgba(134, 148, 177, 0.16) !important',
    backgroundColor: '#fff !important',
    marginTop: '16px !important',
    marginRight: '16px !important',
    borderRadius: '4px',
  },
  '& .displayregion': {
    border: '2px solid #5a79e3 !important',
  },
})
export const OSDContainer = styled('div')({
  flex: 1,
  height: '100%',
})
export const SidePanel = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: '8px',
})

export const Links = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  '& a': {
    display: 'block',
  },
})

export const DescriptionBox = ({
  title,
  description,
}: {
  title: string
  description: React.ReactNode
}) => {
  return (
    <Box
      sx={{
        width: '320px',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Box
        sx={{
          margin: 0,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: 1.5,
          letterSpacing: '0.00938em',
          marginBottom: '0.35em',
        }}
      >
        {description}
      </Box>
    </Box>
  )
}
