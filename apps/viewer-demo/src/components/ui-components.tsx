import { styled } from '@mui/material'

export const Container = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
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
export const Links = styled('div')({
  '& a': {
    display: 'block',
  },
})
