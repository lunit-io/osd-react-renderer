import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import useWebGL from './useWebGL'
import { DescriptionBox } from '../../components/ui-components'

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

export const WebGLOverlayDescription = () => {
  return (
    <DescriptionBox
      title="WebGL Overlay"
      description={
        <div>
          <p>
            WebGL overlay provides a WebGL2 context to render onto with GLSL
            shaders. WebGL copies the final image to a canvas element each
            frame.
          </p>
        </div>
      }
    />
  )
}

export default WebGLOverlayTest
