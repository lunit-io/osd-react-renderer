import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import { DescriptionBox } from '../../components/ui-components'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '@mui/material'

const tiledImageLayerAtom = atom<string>('001')
const tiledImageOverlayLayerAtom = atom<boolean[]>([true, true])

const TiledImageSourceModTest = () => {
  const {
    osdViewerRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportZoom,
  } = useOSDHandlers()

  // const tiledImageLayer = useAtomValue(tiledImageLayerAtom)
  const isVisible = useAtomValue(tiledImageOverlayLayerAtom)

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
            onZoom={handleViewportZoom}
            maxZoomLevel={commonConfig.zoom.controllerMaxZoom * scaleFactor}
            minZoomLevel={commonConfig.zoom.controllerMinZoom * scaleFactor}
          />
          <tiledImage {...tiledImageSource} />
          <tiledImageOverlay
            overlayIndex={1}
            tileUrlBase="http://localhost:4444/img/003"
            url="http://localhost:4444/meta/anything-here"
            isVisible={isVisible[0]}
          />
          <tiledImageOverlay
            overlayIndex={2}
            tileUrlBase="http://localhost:4444/img/002"
            url="http://localhost:4444/meta/anything-here"
            isVisible={isVisible[1]}
          />
        </>
      </OSDViewer>
    </>
  )
}

export const TiledImageSourceModTestDescription = () => {
  const setTiledImageLayer = useSetAtom(tiledImageLayerAtom)
  const [isVisible, setOverlayVisible] = useAtom(tiledImageOverlayLayerAtom)

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
          <Button
            onClick={() =>
              setOverlayVisible(
                isVisible.map((val, ind) => {
                  return ind === 0 ? !isVisible[ind] : val
                })
              )
            }
          >
            {`${isVisible[0] ? 'Hide' : 'Show'} Overlay`}
          </Button>
          <Button
            onClick={() =>
              setOverlayVisible(
                isVisible.map((val, ind) => {
                  return ind === 1 ? !isVisible[ind] : val
                })
              )
            }
          >
            {`${isVisible[1] ? 'Hide' : 'Show'} Overlay`}
          </Button>
        </>
      }
    />
  )
}
export default TiledImageSourceModTest
