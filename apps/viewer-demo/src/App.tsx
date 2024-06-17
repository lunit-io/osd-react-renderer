import { useRoutes, NavLink } from 'react-router-dom'

import {
  Container,
  Links,
  OSDContainer,
  SidePanel,
} from './components/ui-components'
import { Box, Typography } from '@mui/material'
import { descriptions, navLinks, viewerDemos } from './components/routes'

function App() {
  const descriptionRoutes = useRoutes(descriptions)
  const viewerRoutes = useRoutes(viewerDemos)

  return (
    <Container>
      <SidePanel>
        <Typography variant="h6">OpenSeadragon React Renderer Demo</Typography>
        <Links>
          {navLinks.map(({ path, label }) => (
            <NavLink key={path} to={path}>
              {label}
            </NavLink>
          ))}
        </Links>
        <Box>{descriptionRoutes}</Box>
      </SidePanel>
      <OSDContainer>{viewerRoutes}</OSDContainer>
    </Container>
  )
}

export default App
