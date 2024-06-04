import { useCallback, useRef, useState } from 'react'
import {
  CanvasOverlayProps,
  MouseTrackerProps,
  OSDViewerRef,
  ViewportProps,
} from '@lunit/osd-react-renderer'
import { commonConfig } from '../../utils/defaults'
import OpenSeadragon from 'openseadragon'

const useOSDHandlers = () => {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [scaleFactor, setScaleFactor] = useState<number>(1)

  const lastPoint = useRef<OpenSeadragon.Point | null>(null)
  const prevDelta = useRef<OpenSeadragon.Point | null>(null)
  const prevTime = useRef<number>(-1)

  const canvasOverlayRef = useRef(null)
  const osdViewerRef = useRef<OSDViewerRef>(null)

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

  const onCanvasOverlayRedraw: NonNullable<CanvasOverlayProps['onRedraw']> = (
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#000'
      ctx.fillRect(50, 50, 5000, 5000)
    }
  }

  const cancelPanning = useCallback(() => {
    lastPoint.current = null
    prevDelta.current = null
    prevTime.current = -1
  }, [])

  const handleMouseTrackerLeave = useCallback<
    NonNullable<MouseTrackerProps['onLeave']>
  >(() => {
    // temporary fix about malfunction(?) of mouseup and onNonPrimaryRelease event
    cancelPanning?.()
  }, [cancelPanning])

  const handleMouseTrackerNonPrimaryPress = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryPress']>
  >(event => {
    console.log('event', event)
    if (event.button === commonConfig.wheelButton) {
      lastPoint.current = event.position?.clone() || null
      prevDelta.current = new OpenSeadragon.Point(0, 0)
      prevTime.current = 0
    }
  }, [])

  const handleMouseTrackerNonPrimaryRelease = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryRelease']>
  >(
    event => {
      if (event.button === commonConfig.wheelButton) {
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

  return {
    osdViewerRef,
    canvasOverlayRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
    onCanvasOverlayRedraw,
    handleMouseTrackerLeave,
    handleMouseTrackerMove,
    handleMouseTrackerNonPrimaryPress,
    handleMouseTrackerNonPrimaryRelease,
  }
}
export default useOSDHandlers
