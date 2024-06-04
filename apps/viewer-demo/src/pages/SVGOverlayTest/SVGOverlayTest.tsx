import OSDViewer from '../../../../../packages/renderer'
import { DescriptionBox } from '../../components/ui-components'

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

export const SVGOverlayDescription = () => {
  return (
    <DescriptionBox
      title="SVG Overlay"
      description={
        <div>
          <p>
            SVGOverlay provides an SVG element that the developer is able to
            append SVG elements to. The developer must add elements using
            'document.createElementNS' method.
            <br />
            SVGOverlay excels for grid-based image overlays.
          </p>
        </div>
      }
    />
  )
}
export default SVGOverlayTest
