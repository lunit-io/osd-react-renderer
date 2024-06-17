import { useCallback, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import { ToggleButtonGroup } from '@mui/lab'
import reduce from 'lodash/reduce'
import { concat } from 'lodash'
import { Add, Remove } from '@mui/icons-material'
import {
  EndButton,
  SlideContainer,
  ZoomButton,
  ZoomContainer,
} from './ZoomController.styled'

const DEFAULT_ZOOM_LEVELS = [0, 0.5, 1, 2, 5, 10, 20, 40, 160]

export interface ZoomControllerProps {
  noSubdrawer?: boolean
  zoom: number
  minZoomLevel: number
  maxZoomLevel: number
  onZoom?: (newValue: number) => void
}

const ZoomController = ({
  zoom: zoomState,
  minZoomLevel,
  // @todo maxZoomLevel을 구현할 것인지 검토(viewport host component와 스펙 통일)
  onZoom,
}: ZoomControllerProps) => {
  const [levelLabelHidden, setLevelLabelHidden] = useState<boolean>(false)

  const handleChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newZoomLevel: number) => {
      if (!onZoom) {
        return
      }
      onZoom(newZoomLevel)
    },
    [onZoom]
  )

  const zoomLevelLabels = useMemo(() => {
    return reduce(
      DEFAULT_ZOOM_LEVELS,
      (zoomLevels, currLevel) =>
        minZoomLevel >= currLevel ? zoomLevels : concat(zoomLevels, currLevel),
      [minZoomLevel]
    )
  }, [minZoomLevel])

  const getClosestZoomLevel = useCallback(
    (target: number) =>
      zoomLevelLabels.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
      ),
    [zoomLevelLabels]
  )

  const closetZoomLevel = useMemo(
    () => getClosestZoomLevel(zoomState),
    [getClosestZoomLevel, zoomState]
  )

  const handleZoomIn = useCallback(() => {
    if (!onZoom) {
      return
    }
    const currentIdx = zoomLevelLabels.findIndex(
      level => level === getClosestZoomLevel(zoomState)
    )
    if (currentIdx === zoomLevelLabels.length - 1) {
      return
    }
    const nextIdx = currentIdx + 1
    return onZoom(zoomLevelLabels[nextIdx])
  }, [getClosestZoomLevel, zoomState, zoomLevelLabels, onZoom])

  const handleZoomOut = useCallback(() => {
    if (!onZoom) {
      return
    }
    const currentIdx = zoomLevelLabels.findIndex(
      level => level === getClosestZoomLevel(zoomState)
    )
    if (currentIdx === 0) {
      return
    }
    const nextIdx = currentIdx - 1
    return onZoom(zoomLevelLabels[nextIdx])
  }, [getClosestZoomLevel, zoomState, zoomLevelLabels, onZoom])

  return (
    <ZoomContainer>
      <SlideContainer>
        <ToggleButtonGroup
          size="small"
          orientation="vertical"
          value={closetZoomLevel}
          exclusive
          onChange={handleChange}
        >
          <Tooltip
            placement="left"
            title={
              <div>
                Zoom{' '}
                <div onClick={() => setLevelLabelHidden(!levelLabelHidden)}>
                  {levelLabelHidden ? 'Show' : 'Hide'} labels
                </div>
              </div>
            }
            aria-label="zoom-in"
          >
            <EndButton aria-label="zoom-in" onClick={handleZoomIn}>
              <Add />
            </EndButton>
          </Tooltip>
          {!levelLabelHidden &&
            zoomLevelLabels
              // https://stackoverflow.com/questions/5024085/whats-the-point-of-slice0-here
              .slice(0)
              .reverse()
              .map((level, index) => (
                <ZoomButton
                  key={`zoom-level-${level}`}
                  value={level}
                  aria-label={level.toString()}
                >
                  <span>
                    {level <= 40 && index < zoomLevelLabels.length - 1
                      ? `X${level}`
                      : level > 40
                        ? 'MAX'
                        : 'MIN'}
                  </span>
                </ZoomButton>
              ))}
          <Tooltip
            placement="left"
            title={
              <div>
                Zoom{' '}
                <div onClick={() => setLevelLabelHidden(!levelLabelHidden)}>
                  {levelLabelHidden ? 'Show' : 'Hide'} labels
                </div>
              </div>
            }
            aria-label="zoom-out"
          >
            <EndButton aria-label="zoom-out" onClick={handleZoomOut}>
              <Remove />
            </EndButton>
          </Tooltip>
        </ToggleButtonGroup>
      </SlideContainer>
    </ZoomContainer>
  )
}

export default ZoomController
