import OSDViewer from '../../../../../packages/renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import useSVG from './useSVG'

const SVGOverlayTest = () => {
  const {
    osdViewerRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
  } = useOSDHandlers()

  useSVG()
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
          <svgOverlay />
        </>
      </OSDViewer>
    </>
  )
}
export default SVGOverlayTest
