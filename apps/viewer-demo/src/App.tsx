import OSDViewer, {
  ScalebarLocation,
  ViewportProps,
  CanvasOverlayProps,
  OSDViewerRef,
} from '@lunit/osd-react-renderer'
import OpenSeadragon from 'openseadragon'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import Webworker from './workers/WebWorker'
import offscreenWorker from './workers/offscreen.worker'
import { Container, Links, OSDContainer } from './components/ui-components'

import { tiledImageSource, commonConfig, viewerOptions } from './utils/defaults'
import Home from './pages/Home/Home'
import TooltipOverlayTest from './pages/TooltipOverlayTest/TooltipOverlayTest'
import ScaleZoom from './pages/ScaleZoom/ScaleZoom'
import MouseTrackerTest from './pages/MouseTrackerTest/MouseTrackerTest'

let timer: ReturnType<typeof setTimeout>

function App() {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [rotation, setRotation] = useState<number>(0)
  const [scaleFactor, setScaleFactor] = useState<number>(1)
  const [rectSize, setRectSize] = useState<[number, number]>([5000, 5000])

  const [worker, setWorker] = useState<Worker>()
  const canvasOverlayRef = useRef(null)
  const osdViewerRef = useRef<OSDViewerRef>(null)

  useEffect(() => {
    // @ts-ignore
    setWorker(new Webworker(offscreenWorker))
    return () => {
      worker?.terminate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshScaleFactor = useCallback(() => {
    const viewer = osdViewerRef.current?.viewer
    if (!viewer) {
      return
    }
    const imageWidth = viewer.world.getItemAt(0).getContentSize().x
    const microscopeWidth1x =
      ((imageWidth * commonConfig.micronsPerMeter) / 25400) * 96 * 10
    const viewportWidth = viewer.viewport.getContainerSize().x
    setScaleFactor(microscopeWidth1x / viewportWidth)
  }, [])

  const handleViewportOpen = useCallback<
    NonNullable<ViewportProps['onOpen']>
  >(() => {
    refreshScaleFactor()
  }, [refreshScaleFactor])

  const handleViewportResize = useCallback<
    NonNullable<ViewportProps['onResize']>
  >(() => {
    refreshScaleFactor()
  }, [refreshScaleFactor])

  const handleViewportRotate = useCallback<
    NonNullable<ViewportProps['onRotate']>
  >(
    ({ eventSource: viewer, degrees }) => {
      if (viewer == null || degrees == null) {
        return
      }
      refreshScaleFactor()
      setRotation(degrees)
    },
    [refreshScaleFactor]
  )

  const handleViewportZoom = useCallback<NonNullable<ViewportProps['onZoom']>>(
    ({ eventSource: viewer, zoom, refPoint }) => {
      if (viewer == null || zoom == null) {
        return
      }
      setViewportZoom(zoom)
      setRefPoint(refPoint || undefined)
    },
    []
  )

  const handleUpdatedCanvasOverlayRedraw = useCallback<
    NonNullable<CanvasOverlayProps['onRedraw']>
  >(
    (canvas: HTMLCanvasElement, viewer: OpenSeadragon.Viewer) => {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(50, 50, rectSize[0], rectSize[1])
      }
      if (viewer.world && viewer.world.getItemAt(0)) {
        const imgSize = viewer.world.getItemAt(0).getContentSize()
        clearTimeout(timer)
        timer = setTimeout(() => {
          setRectSize([Math.random() * imgSize.x, Math.random() * imgSize.y])
        }, 5000)
      }
    },
    [rectSize]
  )

  return (
    <BrowserRouter>
      <Container>
        <Links>
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/tooltip-overlay">TOOLTIP</NavLink>
          <NavLink to="/scale-zoom">SCALEBAR/ZOOM CTRLS</NavLink>
          <NavLink to="/mouse-tracker">MOUSE TRACKER</NavLink>
          <NavLink to="/test-custom">CUSTOM IMG URL</NavLink>
          <NavLink to="/no-overlay">NO OVERLAY</NavLink>
          <NavLink to="/offscreen">OFFSCREEN</NavLink>
          <NavLink to="/test">TEST</NavLink>
          <NavLink to="/destroy">TEST DESTROY</NavLink>
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
            <Route exact path="/test">
              <OSDViewer
                options={viewerOptions}
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
                  maxZoomLevel={
                    commonConfig.zoom.controllerMaxZoom * scaleFactor
                  }
                  minZoomLevel={
                    commonConfig.zoom.controllerMinZoom * scaleFactor
                  }
                />
                <tiledImage {...tiledImageSource} />
                <scalebar
                  pixelsPerMeter={
                    commonConfig.mpp / commonConfig.micronsPerMeter
                  }
                  xOffset={10}
                  yOffset={30}
                  barThickness={3}
                  color="#443aff"
                  fontColor="#53646d"
                  backgroundColor={'rgba(255,255,255,0.5)'}
                  location={ScalebarLocation.BOTTOM_RIGHT}
                />
                <canvasOverlay
                  ref={canvasOverlayRef}
                  onRedraw={handleUpdatedCanvasOverlayRedraw}
                />
              </OSDViewer>
            </Route>
            <Route exact path="/test-custom">
              <OSDViewer options={viewerOptions} ref={osdViewerRef}>
                <tiledImage {...tiledImageSource} />
              </OSDViewer>
            </Route>
            <Route exact path="/offscreen">
              <OSDViewer
                options={viewerOptions}
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
                  maxZoomLevel={
                    commonConfig.zoom.controllerMaxZoom * scaleFactor
                  }
                  minZoomLevel={
                    commonConfig.zoom.controllerMinZoom * scaleFactor
                  }
                />
                <tiledImage {...tiledImageSource} />
                <scalebar
                  pixelsPerMeter={
                    commonConfig.mpp / commonConfig.micronsPerMeter
                  }
                  xOffset={10}
                  yOffset={30}
                  barThickness={3}
                  color="#443aff"
                  fontColor="#53646d"
                  backgroundColor={'rgba(255,255,255,0.5)'}
                  location={ScalebarLocation.BOTTOM_RIGHT}
                />
                <offscreenOverlay worker={worker} />
              </OSDViewer>
            </Route>
            <Route exact path="/no-overlay">
              <OSDViewer
                options={viewerOptions}
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
                  maxZoomLevel={
                    commonConfig.zoom.controllerMaxZoom * scaleFactor
                  }
                  minZoomLevel={
                    commonConfig.zoom.controllerMinZoom * scaleFactor
                  }
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

export default App
