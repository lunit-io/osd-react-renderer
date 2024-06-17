import { useCallback, useRef, useState } from 'react'
import {
  OSDViewerRef,
  TooltipOverlayProps,
  ViewportProps,
} from '@lunit/osd-react-renderer'
import { commonConfig } from '../../utils/defaults'
import OpenSeadragon from 'openseadragon'

const useOSDHandlers = () => {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [scaleFactor, setScaleFactor] = useState<number>(1)

  const tooltipOverlayRef = useRef(null)
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

  const onTooltipOverlayRedraw: NonNullable<
    TooltipOverlayProps['onRedraw']
  > = ({ tooltipCoord, overlayCanvasEl, viewer }) => {
    const ctx = overlayCanvasEl.getContext('2d')
    if (ctx && tooltipCoord) {
      const radiusPx = commonConfig.radiusUM / commonConfig.mpp
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

  return {
    osdViewerRef,
    tooltipOverlayRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
    onTooltipOverlayRedraw,
  }
}
export default useOSDHandlers
