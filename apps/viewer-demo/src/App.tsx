import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'

import { Container, Links, OSDContainer } from './components/ui-components'

import Home from './pages/Home/Home'
import TooltipOverlayTest from './pages/TooltipOverlayTest/TooltipOverlayTest'
import ScaleZoom from './pages/ScaleZoom/ScaleZoom'
import MouseTrackerTest from './pages/MouseTrackerTest/MouseTrackerTest'
import OffscreenCanvasTest from './pages/OffscreenCanvasTest/OffscreenCanvasTest'
import WebGLOverlayTest from './pages/WebGLOverlayTest/WebGLOverlayTest'
import SVGOverlayTest from './pages/SVGOverlayTest/SVGOverlayTest'

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Links>
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/tooltip-overlay">TOOLTIP</NavLink>
          <NavLink to="/scale-zoom">SCALEBAR/ZOOM CTRLS</NavLink>
          <NavLink to="/mouse-tracker">MOUSE TRACKER</NavLink>
          <NavLink to="/offscreen">OFFSCREEN</NavLink>
          <NavLink to="/webgl-overlay">WEBGL</NavLink>
          <NavLink to="/svg-overlay">SVG</NavLink>
        </Links>
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
