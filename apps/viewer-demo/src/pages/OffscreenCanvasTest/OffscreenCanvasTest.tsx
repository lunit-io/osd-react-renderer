import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'

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
        {osdViewerRef?.current && (
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
        )}
      </OSDViewer>
    </>
  )
}
export default OffscreenCanvasTest
