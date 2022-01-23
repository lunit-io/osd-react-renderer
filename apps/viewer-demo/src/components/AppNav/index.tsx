import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { LINKS } from './const'

const NavLogo = styled('div')({
  position: 'fixed',
  bottom: '16px',
  width: '70px',
  height: '20px',
})

export default function AppNav(): JSX.Element {
  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flex: '0 0 auto',
      }}
    >
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            width: 260,
            background: 'transparent',
            borderRight: 0,
            padding: 2,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            color: theme => theme.palette.darkGrey[70],
          }}
        >
          osd-react-renderer
        </Typography>
        <Typography
          variant="caption"
          sx={{ marginTop: 0.5, color: theme => theme.palette.darkGrey[70] }}
        >
          1.0.0-alpha.1
        </Typography>
        <NavLogo>
          <Image src="/logo.svg" alt="lunit" layout="fill" />
        </NavLogo>
        <Divider />
        <List sx={{ color: theme => theme.palette.darkGrey[70] }}>
          <Link href="/" passHref>
            <ListItemButton component="a">Getting Started</ListItemButton>
          </Link>
          <Link href={LINKS[0].href} passHref>
            <ListItemButton component="a">Basic Features</ListItemButton>
          </Link>
          <List disablePadding sx={{ pt: 0.5 }}>
            {LINKS.map(({ href, name }) => (
              <Link key={href} href={`/${href}`} passHref>
                <ListItemButton component="a" sx={{ pt: 0.5, pb: 0.5, pl: 4 }}>
                  <Typography variant="body5">{name}</Typography>
                </ListItemButton>
              </Link>
            ))}
          </List>
        </List>
      </Drawer>
    </Box>
  )
}
