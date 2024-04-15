import OSDViewer, {
  ScalebarLocation,
  ViewportProps,
  TooltipOverlayProps,
  CanvasOverlayProps,
  MouseTrackerProps,
  OSDViewerRef,
} from '@lunit/osd-react-renderer'
import OpenSeadragon from 'openseadragon'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ZoomController, { ZoomControllerProps } from './ZoomController'
import Webworker from './workers/WebWorker'
import offscreenWorker from './workers/offscreen.worker'

const tiledImageSource = {
  url: 'https://io.api.scope.lunit.io/slides/dzi/metadata/?file=01d0f99c-b4fa-41c1-9059-4c2ee5d4cdf1%2F97e1f14b-d883-409a-83c6-afa97513c146%2FBladder_cancer_01.svs',
  tileUrlBase:
    'https://io.api.scope.lunit.io/slides/images/dzi/01d0f99c-b4fa-41c1-9059-4c2ee5d4cdf1%2F97e1f14b-d883-409a-83c6-afa97513c146%2FBladder_cancer_01.svs',
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  .navigator {
    width: 160px !important;
    height: 160px !important;
    border: solid 1px rgba(134, 148, 177, 0.16) !important;
    background-color: #fff !important;
    margin-top: 16px !important;
    margin-right: 16px !important;
    border-radius: 4px;
  }
  .displayregion {
    border: 2px solid #5a79e3 !important;
  }
`

const OSDContainer = styled.div`
  flex: 1;
  height: 100%;
`

const Links = styled.div`
  width: 100px;
  a {
    display: block;
  }
`

const DEFAULT_CONTROLLER_MIN_ZOOM: number = 0.3125
const DEFAULT_CONTROLLER_MAX_ZOOM: number = 160
const DEMO_MPP = 0.263175
const MICRONS_PER_METER = 1e6
const RADIUS_UM = 281.34
const VIEWER_OPTIONS: OpenSeadragon.Options = {
  mouseNavEnabled: 0,
  debugMode: true,
  imageLoaderLimit: 8,
  smoothTileEdgesMinZoom: Infinity,
  showNavigator: true,
  showNavigationControl: false,
  timeout: 60000,
  navigatorAutoResize: false,
  preserveImageSizeOnResize: true,
  showRotationControl: true,
  zoomPerScroll: 1.3,
  animationTime: 0.3,
  gestureSettingsMouse: {
    clickToZoom: false,
    dblClickToZoom: false,
  },
  gestureSettingsTouch: {
    flickEnabled: false,
    clickToZoom: false,
    dblClickToZoom: false,
  },
}
const WHEEL_BUTTON = 1

const onCanvasOverlayRedraw: NonNullable<CanvasOverlayProps['onRedraw']> = (
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#000'
    ctx.fillRect(50, 50, 5000, 5000)
  }
}

const onTooltipOverlayRedraw: NonNullable<TooltipOverlayProps['onRedraw']> = ({
  tooltipCoord,
  overlayCanvasEl,
  viewer,
}) => {
  const ctx = overlayCanvasEl.getContext('2d')
  if (ctx && tooltipCoord) {
    const radiusPx = RADIUS_UM / DEMO_MPP
    const sizeRect = new OpenSeadragon.Rect(0, 0, 2, 2)
    const lineWidth = viewer.viewport.viewportToImageRectangle(
      viewer.viewport.viewerElementToViewportRectangle(sizeRect)
    ).width
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(tooltipCoord.x, tooltipCoord.y, radiusPx, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
  }
}

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
  const lastPoint = useRef<OpenSeadragon.Point | null>(null)
  const prevDelta = useRef<OpenSeadragon.Point | null>(null)
  const prevTime = useRef<number>(-1)

  useEffect(() => {
    // @ts-ignore
    setWorker(new Webworker(offscreenWorker))
    return () => {
      worker?.terminate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cancelPanning = useCallback(() => {
    lastPoint.current = null
    prevDelta.current = null
    prevTime.current = -1
  }, [])

  const refreshScaleFactor = useCallback(() => {
    const viewer = osdViewerRef.current?.viewer
    if (!viewer) {
      return
    }
    const imageWidth = viewer.world.getItemAt(0).getContentSize().x
    const microscopeWidth1x = ((imageWidth * DEMO_MPP) / 25400) * 96 * 10
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

  const handleControllerZoom = useCallback<
    NonNullable<ZoomControllerProps['onZoom']>
  >(
    zoom => {
      setViewportZoom(zoom * scaleFactor)
    },
    [scaleFactor]
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

  const handleMouseTrackerLeave = useCallback<
    NonNullable<MouseTrackerProps['onLeave']>
  >(() => {
    // temporary fix about malfunction(?) of mouseup and onNonPrimaryRelease event
    cancelPanning?.()
  }, [cancelPanning])

  const handleMouseTrackerNonPrimaryPress = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryPress']>
  >(event => {
    if (event.button === WHEEL_BUTTON) {
      lastPoint.current = event.position?.clone() || null
      prevDelta.current = new OpenSeadragon.Point(0, 0)
      prevTime.current = 0
    }
  }, [])
  const handleMouseTrackerPress = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryPress']>
  >(event => {
    // if (event.button === WHEEL_BUTTON) {
    lastPoint.current = event.position?.clone() || null
    prevDelta.current = new OpenSeadragon.Point(0, 0)
    prevTime.current = 0
    // }
  }, [])

  const handleMouseTrackerNonPrimaryRelease = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryRelease']>
  >(
    event => {
      if (event.button === WHEEL_BUTTON) {
        cancelPanning()
      }
    },
    [cancelPanning]
  )
  const handleMouseTrackerRelease = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryRelease']>
  >(() => {
    cancelPanning()
  }, [cancelPanning])

  const handleMouseTrackerMove = useCallback<
    NonNullable<MouseTrackerProps['onMove']>
  >(event => {
    const viewer = osdViewerRef.current?.viewer
    const throttle = 150
    if (viewer && viewer.viewport) {
      if (lastPoint.current && event.position) {
        const deltaPixels = lastPoint.current.minus(event.position)
        const deltaPoints = viewer.viewport.deltaPointsFromPixels(deltaPixels)
        lastPoint.current = event.position.clone()
        if (!throttle || throttle < 0) {
          viewer.viewport.panBy(deltaPoints)
        } else if (prevDelta.current) {
          const newTimeDelta = Date.now() - prevTime.current
          const newDelta = prevDelta.current.plus(deltaPoints)
          if (newTimeDelta > throttle) {
            viewer.viewport.panBy(newDelta)
            prevDelta.current = new OpenSeadragon.Point(0, 0)
            prevTime.current = 0
          } else {
            prevDelta.current = newDelta
            prevTime.current = newTimeDelta
          }
        }
      }
    }
  }, [])

  console.log('skip:', !!onTooltipOverlayRedraw)

  const handleMouseTrackerScroll = useCallback<
    NonNullable<MouseTrackerProps['onScroll']>
  >(event => {
    const viewer = osdViewerRef.current?.viewer
    const zoomRate = VIEWER_OPTIONS.zoomPerScroll ?? 1

    if (viewer && viewer.viewport) {
      viewer.viewport.zoomBy(
        event.scroll > 0 ? zoomRate : 2 - zoomRate,
        viewer.viewport.pointFromPixel(event.position, true)
      )
    }
  }, [])

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
            <Route exact path="/test">
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
                <scalebar
                  pixelsPerMeter={MICRONS_PER_METER / DEMO_MPP}
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
              <OSDViewer options={VIEWER_OPTIONS} ref={osdViewerRef}>
                <tiledImage {...tiledImageSource} />
              </OSDViewer>
            </Route>
            <Route exact path="/">
              <OSDViewer
                id="osdr-viewer"
                options={VIEWER_OPTIONS}
                ref={osdViewerRef}
                style={{ width: '100%', height: '100%' }}
              >
                <mouseTracker
                  element={'osdr-viewer'}
                  onLeave={handleMouseTrackerLeave}
                  onNonPrimaryPress={handleMouseTrackerNonPrimaryPress}
                  onNonPrimaryRelease={handleMouseTrackerNonPrimaryRelease}
                  onMove={handleMouseTrackerMove}
                  onScroll={event => handleMouseTrackerScroll(event)}
                  onPress={handleMouseTrackerPress}
                  onRelease={handleMouseTrackerRelease}
                />
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
                <scalebar
                  pixelsPerMeter={MICRONS_PER_METER / DEMO_MPP}
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
                  onRedraw={onCanvasOverlayRedraw}
                />
                <offscreenOverlay worker={worker} />
                {/* <tooltipOverlay onRedraw={onTooltipOverlayRedraw} /> */}
              </OSDViewer>
              <ZoomController
                zoom={viewportZoom / scaleFactor}
                maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM}
                minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM}
                onZoom={handleControllerZoom}
              />
            </Route>
            <Route exact path="/offscreen">
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
                <scalebar
                  pixelsPerMeter={MICRONS_PER_METER / DEMO_MPP}
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
                <mouseTracker
                  onLeave={handleMouseTrackerLeave}
                  onNonPrimaryPress={handleMouseTrackerNonPrimaryPress}
                  onNonPrimaryRelease={handleMouseTrackerNonPrimaryRelease}
                  onMove={handleMouseTrackerMove}
                />
              </OSDViewer>
            </Route>
          </OSDContainer>
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

export default App
