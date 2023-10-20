import { useCallback, useEffect, useRef, useState } from 'react'
import { Route } from 'react-router-dom'
import OpenSeadragon from 'openseadragon'

import OSDViewer, {
  ScalebarLocation,
  ViewportProps,
  OSDViewerRef,
  CanvasOverlayProps,
} from '../../../../packages/renderer/src'

import Webworker from '../workers/WebWorker'
import offscreenWorker from '../workers/offscreen.worker'

import {
  DEFAULT_CONTROLLER_MAX_ZOOM,
  DEFAULT_CONTROLLER_MIN_ZOOM,
  DEMO_MPP,
  MICRONS_PER_METER,
  TILED_IMAGE_SOURCE,
  VIEWER_OPTIONS,
} from '../const'

const MultiCanvas = () => {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [rotation, setRotation] = useState<number>(0)
  const [scaleFactor, setScaleFactor] = useState<number>(1)

  const [worker, setWorker] = useState<Worker>()

  const osdViewerRef = useRef<OSDViewerRef>(null)

  const canvasOverlayRef = useRef(null)
  const canvasOverlayOverlayRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    setWorker(new Webworker(offscreenWorker))
    return () => {
      worker?.terminate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdatedCanvasOverlayRedraw = useCallback<
    NonNullable<CanvasOverlayProps['onRedraw']>
  >((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'rgba(255,0,0,0.3)'
      ctx.fillRect(50, 50, 5000, 5000)
    }
  }, [])
  const handleUpdatedCanvasOverlayOverlayRedraw = useCallback<
    NonNullable<CanvasOverlayProps['onRedraw']>
  >((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'rgba(0,255,0,0.3)'
      ctx.fillRect(5500, 50, 5000, 5000)
    }
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

  return (
    <Route exact path="/multi-2d">
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
        <tiledImage {...TILED_IMAGE_SOURCE.bladder_svs} />
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
          overlayID="overlay1"
          ref={canvasOverlayRef}
          onRedraw={handleUpdatedCanvasOverlayRedraw}
        />
        <canvasOverlay
          overlayID="overlay2"
          ref={canvasOverlayOverlayRef}
          onRedraw={handleUpdatedCanvasOverlayOverlayRedraw}
        />
      </OSDViewer>
    </Route>
  )
}
export default MultiCanvas
