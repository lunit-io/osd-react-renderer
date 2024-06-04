import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import useWebGL from './useWebGL'

const WebGLOverlayTest = () => {
  const {
    osdViewerRef,
    canvasOverlayRef,
    webGLOverlayRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
    onCanvasOverlayRedraw,
  } = useOSDHandlers()

  const { onWebGLOverlayRedraw } = useWebGL()

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
          <webGLOverlay ref={webGLOverlayRef} onRedraw={onWebGLOverlayRedraw} />
        </>
      </OSDViewer>
    </>
  )
}
export default WebGLOverlayTest
