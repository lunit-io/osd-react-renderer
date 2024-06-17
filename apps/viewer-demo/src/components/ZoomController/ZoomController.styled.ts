import { Button, ToggleButton, styled } from '@mui/material'

export const ZoomContainer = styled('div')({
  position: 'absolute',
  bottom: 76,
  right: '16px',
})
export const SlideContainer = styled('div')({
  backgroundColor: '#8694B1',
  borderRadius: 4,
  color: '#fff',
  '& .Mui-selected': {
    color: '#fff',
    backgroundColor: '#443AFF',
    '&:hover': {
      backgroundColor: '#443AFF',
    },
  },
})

export const ZoomButton = styled(ToggleButton)({
  backgroundColor: '#fff',
  color: '#585858',
  padding: '5px 7px',
  borderTop: 'none !important', // to override MuiToggleButtonGroup's style
  borderLeft: '1px solid rgba(134, 148, 177, 0.16)',
  borderRight: '1px solid rgba(134, 148, 177, 0.16)',
  borderBottom: '2px solid rgba(134,148,177,0.16)',
  '&:hover': {
    backgroundColor: '#443AFF',
    color: '#fff',
  },
})

export const EndButton = styled(Button)({
  backgroundColor: '#fff',
  padding: '5px 7px',
  borderLeft: '1px solid rgba(134, 148, 177, 0.16)',
  borderRight: '1px solid rgba(134, 148, 177, 0.16)',
  borderBottom: '2px solid rgba(134,148,177,0.16)',
  '&:hover': {
    backgroundColor: '#443AFF',
    color: '#fff',
  },
  minWidth: '16px',
  color: 'rgba(134,148,177,0.8)',
  borderTop: '1px solid rgba(134, 148, 177, 0.16) !important',
})
