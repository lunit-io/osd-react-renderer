import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'

const mouseTrackerOptions = {
  ...viewerOptions,
  mouseNavEnabled: false,
}

const MouseTrackerTest = () => {
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
    handleMouseTrackerMove,
    handleMouseTrackerLeave,
    handleMouseTrackerNonPrimaryPress,
    handleMouseTrackerNonPrimaryRelease,
  } = useOSDHandlers()

  return (
    <>
      <OSDViewer
        options={mouseTrackerOptions}
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
          <mouseTracker
            onLeave={handleMouseTrackerLeave}
            onNonPrimaryPress={handleMouseTrackerNonPrimaryPress}
            onNonPrimaryRelease={handleMouseTrackerNonPrimaryRelease}
            onMove={handleMouseTrackerMove}
          />
        </>
      </OSDViewer>
    </>
  )
}
export default MouseTrackerTest
