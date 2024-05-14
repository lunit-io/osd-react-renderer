import { OSDViewerRef, ViewportProps } from '@lunit/osd-react-renderer'
import { useCallback, useRef, useState } from 'react'
import { DEMO_MPP } from './utils'

function useOSDViewport() {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [rotation, setRotation] = useState<number>(0)
  const [scaleFactor, setScaleFactor] = useState<number>(1)
  // const [rectSize, setRectSize] = useState<[number, number]>([5000, 5000])

  // const [worker, setWorker] = useState<Worker>()
  const canvasOverlayRef = useRef(null)
  const osdViewerRef = useRef<OSDViewerRef>(null)
  // const lastPoint = useRef<OpenSeadragon.Point | null>(null)
  // const prevDelta = useRef<OpenSeadragon.Point | null>(null)
  // const prevTime = useRef<number>(-1)

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

  return {
    osdViewerRef,
    canvasOverlayRef,
    refPoint,
    viewportZoom,
    rotation,
    scaleFactor,
    handlers: {
      handleViewportOpen,
      handleViewportResize,
      handleViewportRotate,
      handleViewportZoom,
    },
  }
}
export default useOSDViewport
