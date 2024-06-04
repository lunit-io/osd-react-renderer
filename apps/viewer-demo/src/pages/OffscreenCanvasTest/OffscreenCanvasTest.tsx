import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import { DescriptionBox } from '../../components/ui-components'

const OffscreenCanvasTest = () => {
  const {
    osdViewerRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
    worker,
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
          <offscreenOverlay worker={worker} />
        </>
      </OSDViewer>
    </>
  )
}
export const OffscreenCanvasDescription = () => {
  return (
    <DescriptionBox
      title="OffscreenCanvas Overlay"
      description={
        <>
          <p>
            OffscreenCanvas is rendered in a separate thread using WebWorkers
            and the Offscreen Canvas API. OffscreenCanvas has size limitations
            that mean it is not suitable for rendering full screen images.
          </p>
        </>
      }
    />
  )
}

export default OffscreenCanvasTest
