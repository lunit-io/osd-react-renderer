import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CanvasOverlayProps,
  OSDViewerRef,
  ViewportProps,
} from '@lunit/osd-react-renderer'
// import { commonConfig } from '../../utils/defaults'
import { useAtom } from 'jotai'
import { viewportZoomAtom } from '../../state'

const useOSDHandlers = () => {
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [scaleFactor] = useState<number>(1)

  const [viewportZoom, setViewportZoom] = useAtom(viewportZoomAtom)

  const canvasOverlayRef = useRef(null)
  const osdViewerRef = useRef<OSDViewerRef>(null)

  const refreshScaleFactor = useCallback(() => {
    // const viewer = osdViewerRef.current?.viewer
    // if (!viewer) {
    //   return
    // }
    // const imageWidth = viewer.world.getItemAt(0).getContentSize().x
    // const microscopeWidth1x =
    //   ((imageWidth * commonConfig.micronsPerMeter) / 25400) * 96 * 10
    // const viewportWidth = viewer.viewport.getContainerSize().x
    // setScaleFactor(microscopeWidth1x / viewportWidth)
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
      console.log('viewport zoom reset', zoom)

      if (viewer == null || zoom == null) {
        return
      }
      setViewportZoom(zoom)
      setRefPoint(refPoint || undefined)
    },
    [setViewportZoom]
  )

  useEffect(() => {
    console.log('zoom reset:', viewportZoom)
  }, [viewportZoom])

  const onCanvasOverlayRedraw: NonNullable<CanvasOverlayProps['onRedraw']> = (
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#000'
      ctx.fillRect(50, 50, 5000, 5000)
    }
  }

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
  }
}
export default useOSDHandlers
