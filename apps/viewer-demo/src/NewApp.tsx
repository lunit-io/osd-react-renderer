import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import { Container, Links, OSDContainer } from './components/styled'
import {
  DEFAULT_CONTROLLER_MAX_ZOOM,
  DEFAULT_CONTROLLER_MIN_ZOOM,
  VIEWER_OPTIONS,
  tiledImageSource,
} from './utils'

import OSDViewer from '@lunit/osd-react-renderer'
import useOSDViewport from './useOSDViewport'

const NewApp = () => {
  const {
    osdViewerRef,
    refPoint,
    viewportZoom,
    rotation,
    scaleFactor,
    handlers,
  } = useOSDViewport()
  const {
    handleViewportOpen,
    handleViewportResize,
    handleViewportRotate,
    handleViewportZoom,
  } = handlers

  return (
    <BrowserRouter>
      <Container>
        <Links>
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/test-custom">CUSTOM IMG URL</NavLink>
          <NavLink to="/no-overlay">NO OVERLAY</NavLink>
          <NavLink to="/offscreen">OFFSCREEN</NavLink>
          <NavLink to="/test">TEST</NavLink>
          <NavLink to="/destroy">TEST DESTROY</NavLink>
        </Links>
        <Switch>
          <OSDContainer>
            <Route exact path="/">
              <OSDViewer
                options={VIEWER_OPTIONS}
                ref={osdViewerRef}
                style={{ width: '100%', height: '100%' }}
              >
                <viewport
                  zoom={viewportZoom}
                  refPoint={refPoint}
                  rotation={rotation}
                  onOpen={handleViewportOpen}
                  onResize={handleViewportResize}
                  onRotate={handleViewportRotate}
                  onZoom={handleViewportZoom}
                  maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM * scaleFactor}
                  minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM * scaleFactor}
                />
                <tiledImage {...tiledImageSource} />
              </OSDViewer>
            </Route>
          </OSDContainer>
        </Switch>
      </Container>
    </BrowserRouter>
  )
}
export default NewApp
