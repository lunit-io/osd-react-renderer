import OSDViewer from '@lunit/osd-react-renderer'

import {
  // tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import { DescriptionBox } from '../../components/ui-components'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '@mui/material'

const tiledImageLayerAtom = atom<string>('001')

const TiledImageSourceModTest = () => {
  const {
    osdViewerRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    // handleViewportOpen,
    // handleViewportResize,
    handleViewportZoom,
  } = useOSDHandlers()

  const tiledImageLayer = useAtomValue(tiledImageLayerAtom)

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
            // onOpen={handleViewportOpen}
            // onResize={handleViewportResize}
            onZoom={handleViewportZoom}
            maxZoomLevel={commonConfig.zoom.controllerMaxZoom * scaleFactor}
            minZoomLevel={commonConfig.zoom.controllerMinZoom * scaleFactor}
          />
          <tiledImage
            tileUrlBase="http://localhost:4444/img/001"
            url="http://localhost:4444/meta/anything-here"
            tiledImageState={{
              layer: tiledImageLayer,
            }}
          />
        </>
      </OSDViewer>
    </>
  )
}

export const TiledImageSourceModTestDescription = () => {
  const setTiledImageLayer = useSetAtom(tiledImageLayerAtom)

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
          <Button onClick={() => setTiledImageLayer('001')}>Layer 001</Button>
          <Button onClick={() => setTiledImageLayer('002')}>Layer 002</Button>
        </>
      }
    />
  )
}
export default TiledImageSourceModTest
