import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'

import {
  Container,
  Links,
  OSDContainer,
  SidePanel,
} from './components/ui-components'

import Home, { HomeDescription } from './pages/Home/Home'
import TooltipOverlayTest, {
  TooltipDescription,
} from './pages/TooltipOverlayTest/TooltipOverlayTest'
import ScaleZoom, { ScaleDescription } from './pages/ScaleZoom/ScaleZoom'
import MouseTrackerTest, {
  MouseTrackerDescription,
} from './pages/MouseTrackerTest/MouseTrackerTest'
import OffscreenCanvasTest, {
  OffscreenCanvasDescription,
} from './pages/OffscreenCanvasTest/OffscreenCanvasTest'
import WebGLOverlayTest, {
  WebGLOverlayDescription,
} from './pages/WebGLOverlayTest/WebGLOverlayTest'
import SVGOverlayTest, {
  SVGOverlayDescription,
} from './pages/SVGOverlayTest/SVGOverlayTest'
import { Box, Typography } from '@mui/material'

function App() {
  return (
    <BrowserRouter>
      <Container>
        <SidePanel>
          <Typography variant="h6">
            OpenSeadragon React Renderer Demo
          </Typography>
          <Links>
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/scale-zoom">SCALEBAR/ZOOM CTRLS</NavLink>
            <NavLink to="/mouse-tracker">MOUSE TRACKER</NavLink>
            <NavLink to="/tooltip-overlay">TOOLTIP OVERLAY</NavLink>
            <NavLink to="/webgl-overlay">WEBGL OVERLAY</NavLink>
            <NavLink to="/offscreen">OFFSCREEN OVERLAY</NavLink>
            <NavLink to="/svg-overlay">SVG OVERLAY</NavLink>
          </Links>
          <Box>
            <Route exact path="/">
              <HomeDescription />
            </Route>
            <Route exact path="/scale-zoom">
              <ScaleDescription />
            </Route>
            <Route exact path="/mouse-tracker">
              <MouseTrackerDescription />
            </Route>
            <Route exact path="/tooltip-overlay">
              <TooltipDescription />
            </Route>
            <Route exact path="/webgl-overlay">
              <WebGLOverlayDescription />
            </Route>
            <Route exact path="/offscreen">
              <OffscreenCanvasDescription />
            </Route>
            <Route exact path="/svg-overlay">
              <SVGOverlayDescription />
            </Route>
          </Box>
        </SidePanel>
        <Switch>
          <OSDContainer>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/tooltip-overlay">
              <TooltipOverlayTest />
            </Route>
            <Route exact path="/scale-zoom">
              <ScaleZoom />
            </Route>
            <Route exact path="/mouse-tracker">
              <MouseTrackerTest />
            </Route>
            <Route exact path="/offscreen">
              <OffscreenCanvasTest />
            </Route>
            <Route exact path="/webgl-overlay">
              <WebGLOverlayTest />
            </Route>
            <Route exact path="/svg-overlay">
              <SVGOverlayTest />
            </Route>
          </OSDContainer>
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

export default App
