import OSDViewer, { ScalebarLocation } from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import ZoomController from '../../ZoomController'
import { DescriptionBox } from '../../components/ui-components'

const ScaleZoom = () => {
  const {
    osdViewerRef,
    canvasOverlayRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
    onCanvasOverlayRedraw,
    handleControllerZoom,
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
          <canvasOverlay
            ref={canvasOverlayRef}
            onRedraw={onCanvasOverlayRedraw}
          />
          <scalebar
            pixelsPerMeter={commonConfig.mpp / commonConfig.micronsPerMeter}
            xOffset={10}
            yOffset={30}
            barThickness={3}
            color="#443aff"
            fontColor="#53646d"
            backgroundColor={'rgba(255,255,255,0.5)'}
            location={ScalebarLocation.BOTTOM_RIGHT}
          />
        </>
      </OSDViewer>
      <ZoomController
        zoom={viewportZoom}
        minZoomLevel={commonConfig.zoom.controllerMinZoom}
        maxZoomLevel={commonConfig.zoom.controllerMaxZoom}
        onZoom={handleControllerZoom}
      />
    </>
  )
}
export const ScaleDescription = () => {
  return (
    <DescriptionBox
      title="Scalebar / Zoom Controls Test"
      description={
        <div>
          <p>
            Demonstrating the usage of the scalebar and zoom control components.
          </p>
          <p>
            Zoom Controls should update along with the zoom level of the
            viewport.
          </p>
        </div>
      }
    />
  )
}

export default ScaleZoom
