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
import Webworker from './classes/WebWorker'
import testWorker from './classes/test.worker'
// import { OffscreenOverlayProps } from 'packages/renderer/dist/types/types'

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
const VIEWER_OPTIONS = {
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

let offscreen: OffscreenCanvas | null = null
// let timer: ReturnType<typeof setTimeout>

function App() {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [rotation, setRotation] = useState<number>(0)
  const [scaleFactor, setScaleFactor] = useState<number>(1)
  // const [rectSize, setRectSize] = useState<[number, number]>([5000, 5000])
  const [worker, setWorker] = useState<any>()
  const canvasOverlayRef = useRef(null)
  // const offscreenOverlayRef = useRef(null)
  const osdViewerRef = useRef<OSDViewerRef>(null)
  const lastPoint = useRef<OpenSeadragon.Point | null>(null)
  const prevDelta = useRef<OpenSeadragon.Point | null>(null)
  const prevTime = useRef<number>(-1)

  useEffect(() => {
    setWorker(new Webworker(testWorker))
    if (canvasOverlayRef.current) {
      const canvasInfo = canvasOverlayRef.current as any
      // const offscreenInfo = offscreenOverlayRef.current as any
      // offscreen = offscreenInfo.viewer._offscreenOverlayInfo._offscreen
      offscreen = canvasInfo.viewer._canvasOverlayInfo._offscreen
      offscreen!.height = canvasInfo.viewer.container.clientHeight
      offscreen!.width = canvasInfo.viewer.container.clientWidth
    }
    return () => {
      worker?.terminate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (worker && offscreen) {
      worker.postMessage(
        {
          action: 'canvas',
          canvas: offscreen,
        },
        [offscreen]
      )
      worker.postMessage({ action: 'prepare' })
    }
  }, [worker])

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

  // const handleUpdatedOffscreenOverlayRedraw: OffscreenOverlayProps['onRedraw'] =
  //   useCallback(
  //     (offscreen: OffscreenCanvas, viewer: OpenSeadragon.Viewer) => {
  //       console.log('redraw!')
  //       const ctx = offscreen.getContext('2d')
  //       console.log('ctx :', ctx)
  //       console.log('viewer :', viewer)

  //       const viewportZoom = viewer.viewport.getZoom(true)
  //       const image1 = viewer.world.getItemAt(0)
  //       const zoom = image1.viewportToImageZoom(viewportZoom)

  //       const containerWidth = viewer.container.clientWidth
  //       const containerHeight = viewer.container.clientHeight
  //       const viewportOrigin = new OpenSeadragon.Point(0, 0)
  //       const boundsRect = viewer.viewport.getBounds(true)
  //       const imgWidth = image1.source.dimensions.x
  //       const imgHeight = image1.source.dimensions.y
  //       const imgAspectRatio = imgWidth / imgHeight
  //       viewportOrigin.x = boundsRect.x
  //       viewportOrigin.y = boundsRect.y * imgAspectRatio

  //       const viewportWidth = boundsRect.width
  //       const viewportHeight = boundsRect.height * imgAspectRatio
  //       const x =
  //         ((viewportOrigin.x / imgWidth - viewportOrigin.x) / viewportWidth) *
  //         containerWidth
  //       const y =
  //         ((viewportOrigin.y / imgHeight - viewportOrigin.y) / viewportHeight) *
  //         containerHeight

  //       worker.postMessage({
  //         action: 'redraw',
  //         position: { x, y },
  //         zoom,
  //         imgWidth,
  //         imgHeight,
  //       })
  //     },
  //     [worker]
  //   )

  const handleUpdatedCanvasOverlayRedraw: CanvasOverlayProps['onRedraw'] =
    useCallback(
      (canvas: HTMLCanvasElement, viewer: OpenSeadragon.Viewer) => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)'
          ctx.fillRect(0, 0, 5000, 5000)
        }

        const viewportZoom = viewer.viewport.getZoom(true)
        const image1 = viewer.world.getItemAt(0)
        const zoom = image1.viewportToImageZoom(viewportZoom)

        const containerWidth = viewer.container.clientWidth
        const containerHeight = viewer.container.clientHeight
        const viewportOrigin = new OpenSeadragon.Point(0, 0)
        const boundsRect = viewer.viewport.getBounds(true)
        const imgWidth = image1.source.dimensions.x
        const imgHeight = image1.source.dimensions.y
        const imgAspectRatio = imgWidth / imgHeight
        viewportOrigin.x = boundsRect.x
        viewportOrigin.y = boundsRect.y * imgAspectRatio

        const viewportWidth = boundsRect.width
        const viewportHeight = boundsRect.height * imgAspectRatio
        const x =
          ((viewportOrigin.x / imgWidth - viewportOrigin.x) / viewportWidth) *
          containerWidth
        const y =
          ((viewportOrigin.y / imgHeight - viewportOrigin.y) / viewportHeight) *
          containerHeight

        worker.postMessage({
          action: 'redraw',
          position: { x, y },
          zoom,
          imgWidth,
          imgHeight,
        })
        // if (viewer.world && viewer.world.getItemAt(0)) {
        //   const imgSize = viewer.world.getItemAt(0).getContentSize()
        //   clearTimeout(timer)
        //   timer = setTimeout(() => {
        //     setRectSize([Math.random() * imgSize.x, Math.random() * imgSize.y])
        //   }, 5000)
        // }
      },
      [worker]
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

  return (
    <BrowserRouter>
      <Container>
        <Links>
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/test-custom">CUSTOM IMG URL</NavLink>
          <NavLink to="/no-overlay">NO OVERLAY</NavLink>
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
                <tiledImage url="https://api.pdl1.demo.scope.lunit.io/slides/images/dzi/c76175c1-dd83-4e94-8d54-978903c753ec/16/76a4a313-3865-4232-ba26-449a664204f4/Lung_cancer_14-TPS_50-100.svs" />
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
                {/* <offscreenOverlay
                  ref={offscreenOverlayRef}
                  onRedraw={handleUpdatedOffscreenOverlayRedraw}
                /> */}
              </OSDViewer>
            </Route>
            <Route exact path="/test-custom">
              <OSDViewer options={VIEWER_OPTIONS} ref={osdViewerRef}>
                <tiledImage
                  url="https://pdl1.api.dev.scope.lunit.io/slides/dzi/metadata?file=mrxs_test/SIZE_TEST_2.mrxs"
                  tileUrlBase="https://pdl1.api.dev.scope.lunit.io/slides/images/dzi/mrxs_test/SIZE_TEST_2.mrxs"
                />
              </OSDViewer>
            </Route>
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
                <tiledImage url="https://api.pdl1.demo.scope.lunit.io/slides/images/dzi/c76175c1-dd83-4e94-8d54-978903c753ec/16/76a4a313-3865-4232-ba26-449a664204f4/Lung_cancer_14-TPS_50-100.svs" />
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
                <tooltipOverlay onRedraw={onTooltipOverlayRedraw} />
                <mouseTracker
                  onLeave={handleMouseTrackerLeave}
                  onNonPrimaryPress={handleMouseTrackerNonPrimaryPress}
                  onNonPrimaryRelease={handleMouseTrackerNonPrimaryRelease}
                  onMove={handleMouseTrackerMove}
                />
              </OSDViewer>
              <ZoomController
                zoom={viewportZoom / scaleFactor}
                maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM}
                minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM}
                onZoom={handleControllerZoom}
              />
            </Route>
            <Route exact path="/no-overlay">
              <OSDViewer options={VIEWER_OPTIONS} ref={osdViewerRef}>
                <tiledImage url="https://image-pdl1.api.opt.scope.lunit.io/slides/images/dzi/41f49f4c-8dcd-4e85-9e7d-c3715f391d6f/3/122145f9-7f68-4f85-82f7-5b30364c2323/D_202103_Lunit_NSCLC_011_IHC_22C3.svs" />
              </OSDViewer>
            </Route>
          </OSDContainer>
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

export default App
