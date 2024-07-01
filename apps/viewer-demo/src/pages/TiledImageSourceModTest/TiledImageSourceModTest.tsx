import OSDViewer from '@lunit/osd-react-renderer'

import {
  tiledImageSource,
  commonConfig,
  viewerOptions,
} from '../../utils/defaults'
import useOSDHandlers from './useOSDHandlers'
import { DescriptionBox } from '../../components/ui-components'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Button, MenuItem, Select, Typography } from '@mui/material'

const tiledImageVisibilityAtom = atom([true, true, true, true])
const tiledImageColorAtom = atom(['RED', 'RED', 'RED', 'RED'])
const tiledImageShapeAtom = atom(['SQUARE', 'SQUARE', 'SQUARE', 'SQUARE'])

const TiledImageSourceModTest = () => {
  const {
    osdViewerRef,
    viewportZoom,
    refPoint,
    scaleFactor,
    handleViewportZoom,
  } = useOSDHandlers()

  const visibility = useAtomValue(tiledImageVisibilityAtom)
  const color = useAtomValue(tiledImageColorAtom)
  const shape = useAtomValue(tiledImageShapeAtom)

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
          <tiledImage
            index={1}
            tileUrlBase="http://localhost:4444/complex/00/"
            url="http://localhost:4444/meta/anything-here"
            isVisible={visibility[0]}
            queryParams={{ color: color[0], shape: shape[0] }}
          />
          <tiledImage
            index={2}
            tileUrlBase="http://localhost:4444/complex/01/"
            url="http://localhost:4444/meta/anything-here"
            isVisible={visibility[1]}
            queryParams={{ color: color[1], shape: shape[1] }}
          />
          <tiledImage
            index={3}
            tileUrlBase="http://localhost:4444/complex/02/"
            url="http://localhost:4444/meta/anything-here"
            isVisible={visibility[2]}
            queryParams={{ color: color[2], shape: shape[2] }}
          />
          <tiledImage
            index={4}
            tileUrlBase="http://localhost:4444/complex/03/"
            url="http://localhost:4444/meta/anything-here"
            isVisible={visibility[3]}
            queryParams={{ color: color[3], shape: shape[3] }}
          />
        </>
      </OSDViewer>
    </>
  )
}

export const TiledImageSourceModTestDescription = () => {
  const [visibility, setVisibility] = useAtom(tiledImageVisibilityAtom)
  const [color, setColor] = useAtom(tiledImageColorAtom)
  const [shape, setShape] = useAtom(tiledImageShapeAtom)

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <LayerCtrl
              layer="00"
              isOn={visibility[0]}
              handleVisibility={() => {
                setVisibility(prev => [!prev[0], prev[1], prev[2], prev[3]])
              }}
              color={color[0]}
              handleColor={color => {
                setColor(prev => [color, prev[1], prev[2], prev[3]])
              }}
              shape={shape[0]}
              handleShape={shape => {
                setShape(prev => [shape, prev[1], prev[2], prev[3]])
              }}
            />
            <LayerCtrl
              layer="01"
              isOn={visibility[1]}
              handleVisibility={() => {
                setVisibility(prev => [prev[0], !prev[1], prev[2], prev[3]])
              }}
              color={color[1]}
              handleColor={color => {
                setColor(prev => [prev[0], color, prev[2], prev[3]])
              }}
              shape={shape[1]}
              handleShape={shape => {
                setShape(prev => [prev[0], shape, prev[2], prev[3]])
              }}
            />
            <LayerCtrl
              layer="02"
              isOn={visibility[2]}
              handleVisibility={() => {
                setVisibility(prev => [prev[0], prev[1], !prev[2], prev[3]])
              }}
              color={color[2]}
              handleColor={color => {
                setColor(prev => [prev[0], prev[1], color, prev[3]])
              }}
              shape={shape[2]}
              handleShape={shape => {
                setShape(prev => [prev[0], prev[1], shape, prev[3]])
              }}
            />
            <LayerCtrl
              layer="03"
              isOn={visibility[3]}
              handleVisibility={() => {
                setVisibility(prev => [prev[0], prev[1], prev[2], !prev[3]])
              }}
              color={color[3]}
              handleColor={color => {
                setColor(prev => [prev[0], prev[1], prev[2], color])
              }}
              shape={shape[3]}
              handleShape={shape => {
                setShape(prev => [prev[0], prev[1], prev[2], shape])
              }}
            />
          </div>
        </>
      }
    />
  )
}

const LayerCtrl = ({
  layer,
  isOn,
  handleVisibility,
  color,
  handleColor,
  shape,
  handleShape,
}: {
  layer: string
  isOn: boolean
  handleVisibility: () => void
  color: string
  handleColor: (color: string) => void
  shape: string
  handleShape: (shape: string) => void
}) => {
  return (
    <div>
      <Typography variant="h6">Layer {layer}</Typography>
      <Button onClick={handleVisibility}>Turn {isOn ? 'Off' : 'On'}</Button>
      <Select
        value={color}
        onChange={e => handleColor(e.target.value)}
        style={{ width: '100px' }}
      >
        <MenuItem value="RED">Red</MenuItem>
        <MenuItem value="BLUE">Blue</MenuItem>
        <MenuItem value="GREEN">Green</MenuItem>
      </Select>
      <Select
        value={shape}
        onChange={e => handleShape(e.target.value)}
        style={{ width: '100px' }}
      >
        <MenuItem value="SQUARE">Square</MenuItem>
        <MenuItem value="TRIANGLE">Triangle</MenuItem>
        <MenuItem value="PENTAGON">Pentagon</MenuItem>
      </Select>
    </div>
  )
}

export default TiledImageSourceModTest
