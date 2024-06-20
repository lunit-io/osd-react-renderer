import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import { DescriptionBox } from '../../components/ui-components'

const TiledImageSourceModTest = () => {
  const {
    osdViewerRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportOpen,
    handleViewportResize,
    handleViewportZoom,
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
          {/* <tiledImage {...tiledImageSource} /> */}
        </>
      </OSDViewer>
    </>
  )
}

export const TiledImageSourceModTestDescription = () => {
  return (
    <DescriptionBox
      title="Tiled Image Overlay"
      description={
        <>
          <div>
            This page demonstrates layering tiledImage elements, and controlling
            them with props.
          </div>
          <div>
            You will need to run a tiler server to use the additional tiles
          </div>
        </>
      }
    />
  )
}
export default TiledImageSourceModTest
