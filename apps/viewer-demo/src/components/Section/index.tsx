import React, { ReactNode } from 'react'
import { styled } from '@mui/material/styles'

interface SectionProps {
  children: ReactNode
}
const SectionBox = styled('div')({
  display: 'flex',
  width: '100%',
})

export default function Section({ children }: SectionProps): JSX.Element {
  return <SectionBox>{children}</SectionBox>
}
