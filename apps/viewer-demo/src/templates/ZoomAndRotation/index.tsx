import React, { useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import Image from 'next/image'
import { OSDViewerRef, ViewportProps } from '@lunit/osd-react-renderer'
import OSDViewer, { ScalebarLocation } from '../../components/OSDViewer'
import Code from '../../components/Code'
import Description from '../../components/Description'
import Section from '../../components/Section'
import { FULL_SOURCE, SOURCE } from './const'
import { CODE_SANDBOX } from '../const'

const VIEWER_OPTIONS = {
  imageLoaderLimit: 8,
  smoothTileEdgesMinZoom: Infinity,
  showNavigator: true,
  showNavigationControl: false,
  timeout: 60000,
  navigatorAutoResize: false,
  preserveImageSizeOnResize: true,
  showRotationControl: true,
  zoomPerScroll: 1.3,
  animationTime: 0.3,
  gestureSettingsMouse: {
    clickToZoom: false,
    dblClickToZoom: false,
  },
  gestureSettingsTouch: {
    flickEnabled: false,
    clickToZoom: false,
    dblClickToZoom: false,
  },
}

const DEFAULT_CONTROLLER_MIN_ZOOM = 0.3125
const DEFAULT_CONTROLLER_MAX_ZOOM = 160
const DEMO_MPP = 0.263175
const MICRONS_PER_METER = 1e6

const ButtonBox = styled('div')({
  position: 'absolute',
  top: 32,
  left: 38,
  display: 'flex',
  justifyContent: 'space-between',
})

export default function ZoomAndRotation(): JSX.Element {
  const [viewportZoom, setViewportZoom] = useState<number>(1)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [rotation, setRotation] = useState<number>(0)
  const [scaleFactor, setScaleFactor] = useState<number>(1)

  const osdViewerRef = useRef<OSDViewerRef>(null)

  const refreshScaleFactor = () => {
    const viewer = osdViewerRef.current?.viewer
    if (!viewer) {
      return
    }
    const imageWidth = viewer.world.getItemAt(0).getContentSize().x
    const microscopeWidth1x = ((imageWidth * DEMO_MPP) / 25400) * 96 * 10
    const viewportWidth = viewer.viewport.getContainerSize().x
    setScaleFactor(microscopeWidth1x / viewportWidth)
  }

  const handleViewportOpen: ViewportProps['onOpen'] = () => {
    refreshScaleFactor()
  }

  const handleViewportResize: ViewportProps['onResize'] = () => {
    refreshScaleFactor()
  }

  const handleViewportRotate: ViewportProps['onRotate'] = ({
    eventSource: viewer,
    degrees,
  }) => {
    if (viewer == null || degrees == null) {
      return
    }
    refreshScaleFactor()
    setRotation(degrees)
  }

  const handleViewportZoom: ViewportProps['onZoom'] = ({
    eventSource: viewer,
    newZoom,
    newRefPoint,
  }) => {
    if (viewer == null || newZoom == null) {
      return
    }
    setViewportZoom(newZoom)
    setRefPoint(newRefPoint || undefined)
  }

  const handleRotateLeft = () => {
    setRotation(rotation - 90)
  }

  const handleRotateRight = () => {
    setRotation(rotation + 90)
  }

  return (
    <Section>
      <Description>
        <OSDViewer options={VIEWER_OPTIONS}>
          <viewport
            zoom={viewportZoom}
            refPoint={refPoint}
            rotation={rotation}
            onOpen={handleViewportOpen}
            onResize={handleViewportResize}
            onRotate={handleViewportRotate}
            onZoom={handleViewportZoom}
            maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM * scaleFactor}
            minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM * scaleFactor}
          />
          <tiledImage url="https://api.pdl1.demo.scope.lunit.io/slides/images/dzi/c76175c1-dd83-4e94-8d54-978903c753ec/16/76a4a313-3865-4232-ba26-449a664204f4/Lung_cancer_14-TPS_50-100.svs" />
          <scalebar
            pixelsPerMeter={MICRONS_PER_METER / DEMO_MPP}
            xOffset={10}
            yOffset={30}
            barThickness={3}
            color="#443aff"
            fontColor="#53646d"
            backgroundColor="rgba(255,255,255,0.5)"
            location={ScalebarLocation.BOTTOM_RIGHT}
          />
        </OSDViewer>
        <ButtonBox>
          <IconButton onClick={handleRotateLeft}>
            <Image
              src="/rotate-left.svg"
              alt="Rotate Left"
              width="24"
              height="24"
            />
          </IconButton>
          <IconButton onClick={handleRotateRight}>
            <Image
              src="/rotate-right.svg"
              alt="Rotate Right"
              width="24"
              height="24"
            />
          </IconButton>
        </ButtonBox>
      </Description>
      <Code
        source={SOURCE}
        fullSource={FULL_SOURCE}
        codesandboxUrl={CODE_SANDBOX.zoomAndRotation}
      />
    </Section>
  )
}
