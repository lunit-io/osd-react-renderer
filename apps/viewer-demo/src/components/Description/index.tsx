import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

interface DescriptionProps {
  children: ReactNode
}
export default function Description({
  children,
}: DescriptionProps): JSX.Element {
  return (
    <Box
      sx={{
        position: 'relative',
        flex: '1 0 auto',
        width: 0,
        padding: 3,
      }}
    >
      {children}
    </Box>
  )
}
