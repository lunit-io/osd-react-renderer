import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import { DescriptionBox } from '../../components/ui-components'

const TooltipOverlayTest = () => {
  const {
    osdViewerRef,
    tooltipOverlayRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
    onTooltipOverlayRedraw,
  } = useOSDHandlers()

  return (
    <>
      <OSDViewer
        options={viewerOptions}
        ref={osdViewerRef}
        style={{ width: '100%', height: '100%' }}
      >
        <>
          <viewport
            zoom={viewportZoom}
            refPoint={refPoint}
            rotation={commonConfig.rotation}
            onOpen={handleViewportOpen}
            onResize={handleViewportResize}
            onZoom={handleViewportZoom}
            maxZoomLevel={commonConfig.zoom.controllerMaxZoom * scaleFactor}
            minZoomLevel={commonConfig.zoom.controllerMinZoom * scaleFactor}
          />
          <tiledImage {...tiledImageSource} />
          <tooltipOverlay
            ref={tooltipOverlayRef}
            onRedraw={onTooltipOverlayRedraw}
          />
        </>
      </OSDViewer>
    </>
  )
}

export const TooltipDescription = () => {
  return (
    <DescriptionBox
      title="Tooltip Overlay"
      description={
        <div>
          <div>
            Tooltip overlay is an implementation of canvasOverlay that has an
            additional parameter for mouse position.
          </div>
        </div>
      }
    />
  )
}
export default TooltipOverlayTest
